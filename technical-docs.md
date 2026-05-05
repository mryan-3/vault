# WhisperBox Cryptographic Technical Specification

This document outlines the End-to-End Encryption (E2EE) architecture implemented in this application.

## 1. Core Principles
- **Zero-Knowledge:** The server stores and forwards data but lacks the keys to decrypt it.
- **Client-Side Sovereignty:** All cryptographic operations (KeyGen, Encryption, Decryption) occur exclusively in the browser using the Web Crypto API.
- **Hybrid Encryption:** Combines RSA (Asymmetric) for key exchange and identity with AES (Symmetric) for performant data encryption.

## 2. Key Management & Identity

### User Key Pair
- **Algorithm:** RSA-OAEP (2048-bit).
- **Public Key:** Exported as Base64 and stored on the server. Used by others to encrypt session keys for the user.
- **Private Key:** Exported as PKCS#8, then wrapped (encrypted) before being sent to the server.

### Key Wrapping (Security for the Private Key)
To allow cross-device login without compromising the private key:
1. **PBKDF2 Derivation:** The user's password + a random 128-bit salt are processed through PBKDF2 (100,000+ iterations) to derive a 256-bit **Master Wrapping Key**.
2. **AES-KW (Key Wrap):** The RSA Private Key is encrypted using the Master Wrapping Key using the AES-KW algorithm.
3. **Persistence:** Only the **Wrapped Private Key** and **Salt** are stored on the server. The Master Wrapping Key and raw Private Key exist only in transient browser RAM during a session.

## 3. The Hybrid Encryption Flow

### Sending a Message
When Alice sends a message to Bob:
1. **Session Key Generation:** Alice's browser generates a random 256-bit **AES-GCM key** (the "Session Key") and a 96-bit **IV**.
2. **Payload Encryption:** The plaintext message is encrypted with the AES-GCM Session Key.
3. **Double Key Exchange:**
   - **For Recipient:** The AES Session Key is encrypted with **Bob's RSA Public Key**.
   - **For Sender:** The AES Session Key is encrypted with **Alice's RSA Public Key** (allowing Alice to decrypt her own "Sent" messages later).
4. **Transmission:** Alice sends the `ciphertext`, `iv`, and both `encryptedKeys` to the server.

### Receiving a Message
When Bob receives the payload:
1. **Key Decryption:** Bob uses his **RSA Private Key** to decrypt the `encryptedKey` field. He now has the AES Session Key.
2. **Payload Decryption:** Bob uses the AES Session Key + `iv` to decrypt the `ciphertext` into the original plaintext.

## 4. Storage & Security
- **Memory Safety:** Sensitive keys (unwrapped RSA key, AES session keys) are kept in memory and never written to `localStorage`.
- **IndexedDB:** Can be used to cache the wrapped private key for faster session recovery, but the password is always required to unwrap it.
- **Token Management:** JWT Access Tokens (15m expiry) and Refresh Tokens are used for API authentication, separate from the encryption layer.
