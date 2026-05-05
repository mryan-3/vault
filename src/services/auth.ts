import { AuthResponse, User } from "@/types/auth";
import { 
  generateRSAKeyPair, 
  exportPublicKey, 
  deriveWrappingKey, 
  wrapPrivateKey, 
  unwrapPrivateKey,
  base64ToArrayBuffer,
  arrayBufferToBase64
} from "@/lib/crypto";

const BASE_URL = "https://whisperbox.koyeb.app";

export const authService = {
  async register(username: string, displayName: string, password: string): Promise<AuthResponse> {
    // 1. Generate E2EE Keys
    const keyPair = await generateRSAKeyPair();
    const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
    
    // 2. Prepare for Key Wrapping
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await deriveWrappingKey(password, salt.buffer);
    const wrappedPrivateKey = await wrapPrivateKey(keyPair.privateKey, wrappingKey);

    // 3. Send to Server
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        display_name: displayName,
        password,
        public_key: publicKeyBase64,
        wrapped_private_key: wrappedPrivateKey,
        pbkdf2_salt: arrayBufferToBase64(salt),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<{ data: AuthResponse; privateKey: CryptoKey }> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data: AuthResponse = await response.json();
    
    // 4. Unwrap the Private Key immediately
    const privateKey = await this.unlock(data.user, password);

    return { data, privateKey };
  },

  async unlock(user: User, password: string): Promise<CryptoKey> {
    const saltBuffer = base64ToArrayBuffer(user.pbkdf2_salt);
    const wrappingKey = await deriveWrappingKey(password, saltBuffer);
    return await unwrapPrivateKey(user.wrapped_private_key, wrappingKey);
  },
};
