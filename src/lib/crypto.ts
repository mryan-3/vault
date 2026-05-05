/**
 * Web Crypto API Utilities for E2EE
 * All operations are performed client-side.
 */

const RSA_ALGO = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

const AES_GCM_ALGO = "AES-GCM";
const AES_KW_ALGO = "AES-KW";
const PBKDF2_ALGO = "PBKDF2";

// --- Helpers ---

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- Key Generation ---

export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    RSA_ALGO,
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

// --- Key Wrapping (PBKDF2 + AES-KW) ---

export async function deriveWrappingKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    PBKDF2_ALGO,
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: PBKDF2_ALGO,
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: AES_KW_ALGO, length: 256 },
    false,
    ["wrapKey", "unwrapKey"]
  );
}

export async function wrapPrivateKey(privateKey: CryptoKey, wrappingKey: CryptoKey): Promise<string> {
  const wrapped = await window.crypto.subtle.wrapKey(
    "pkcs8",
    privateKey,
    wrappingKey,
    AES_KW_ALGO
  );
  return arrayBufferToBase64(wrapped);
}

export async function unwrapPrivateKey(wrappedKeyBase64: string, wrappingKey: CryptoKey): Promise<CryptoKey> {
  const wrappedBuffer = base64ToArrayBuffer(wrappedKeyBase64);
  return window.crypto.subtle.unwrapKey(
    "pkcs8",
    wrappedBuffer,
    wrappingKey,
    AES_KW_ALGO,
    RSA_ALGO,
    true,
    ["decrypt"]
  );
}

// --- Hybrid Encryption (RSA + AES-GCM) ---

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  encryptedKey: string;
  encryptedKeyForSelf: string;
}

export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: CryptoKey,
  senderPublicKey: CryptoKey
): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  // 1. Generate random AES-GCM session key
  const sessionKey = await window.crypto.subtle.generateKey(
    { name: AES_GCM_ALGO, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Encrypt plaintext with AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: AES_GCM_ALGO, iv },
    sessionKey,
    encodedPlaintext
  );

  // 3. Export session key and encrypt it for both parties
  const exportedSessionKey = await window.crypto.subtle.exportKey("raw", sessionKey);
  
  const [encKeyForRecipient, encKeyForSelf] = await Promise.all([
    window.crypto.subtle.encrypt(RSA_ALGO, recipientPublicKey, exportedSessionKey),
    window.crypto.subtle.encrypt(RSA_ALGO, senderPublicKey, exportedSessionKey),
  ]);

  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
    encryptedKey: arrayBufferToBase64(encKeyForRecipient),
    encryptedKeyForSelf: arrayBufferToBase64(encKeyForSelf),
  };
}

export async function decryptMessage(
  payload: EncryptedPayload,
  privateKey: CryptoKey,
  isSender: boolean = false
): Promise<string> {
  const dec = new TextDecoder();
  const encryptedSessionKey = base64ToArrayBuffer(isSender ? payload.encryptedKeyForSelf : payload.encryptedKey);
  const ciphertext = base64ToArrayBuffer(payload.ciphertext);
  const iv = base64ToArrayBuffer(payload.iv);

  // 1. Decrypt the session key using RSA
  const sessionKeyBuffer = await window.crypto.subtle.decrypt(
    RSA_ALGO,
    privateKey,
    encryptedSessionKey
  );

  // 2. Import the decrypted session key
  const sessionKey = await window.crypto.subtle.importKey(
    "raw",
    sessionKeyBuffer,
    AES_GCM_ALGO,
    false,
    ["decrypt"]
  );

  // 3. Decrypt the message
  const plaintextBuffer = await window.crypto.subtle.decrypt(
    { name: AES_GCM_ALGO, iv: new Uint8Array(iv) },
    sessionKey,
    ciphertext
  );

  return dec.decode(plaintextBuffer);
}

// --- Public Key Export/Import ---

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  return arrayBufferToBase64(exported);
}

export async function importPublicKey(base64: string): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(base64);
  return window.crypto.subtle.importKey(
    "spki",
    buffer,
    RSA_ALGO,
    true,
    ["encrypt"]
  );
}
