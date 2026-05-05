/**
 * Integration Test for E2EE Flow
 * This simulates a full run of the engine: 
 * Register -> Login -> Unlock -> Encrypt -> Decrypt
 * 
 * NOTE: This is intended to be run in a browser environment (or a test runner with Web Crypto support)
 */

import { authService } from "@/services/auth";
import { encryptMessage, decryptMessage, importPublicKey } from "@/lib/crypto";

export async function runIntegrationTest() {
  console.log("Starting E2EE Integration Test...");

  const testUsername = `test_user_${Math.floor(Math.random() * 10000)}`;
  const testPassword = "StrongPassword123!";
  const testDisplayName = "Test User";

  try {
    // 1. Test Registration
    console.log("1. Registering user...");
    const regResponse = await authService.register(testUsername, testDisplayName, testPassword);
    console.log("Registration Successful. ID:", regResponse.user.id);

    // 2. Test Login
    console.log("2. Logging in...");
    const { data: loginData, privateKey } = await authService.login(testUsername, testPassword);
    console.log("Login Successful. Token obtained.");

    // 3. Test Key Integrity
    if (!privateKey) throw new Error("Private key was not recovered after login");
    console.log("Private Key successfully unwrapped in memory.");

    // 4. Test Encryption (Self-messaging simulation)
    console.log("4. Simulating self-encryption...");
    const originalText = "This is a highly secret E2EE message!";
    const publicKey = await importPublicKey(loginData.user.public_key);
    
    const encryptedPayload = await encryptMessage(
      originalText,
      publicKey, // Recipient is self
      publicKey  // Sender is self
    );
    console.log("Encryption successful. Ciphertext length:", encryptedPayload.ciphertext.length);

    // 5. Test Decryption
    console.log("5. Testing decryption...");
    const decryptedText = await decryptMessage(encryptedPayload, privateKey, true);
    
    if (decryptedText === originalText) {
      console.log("DECRYPTION SUCCESSFUL! Content matches.");
      console.log("Result:", decryptedText);
    } else {
      throw new Error(`Decryption failed. Expected "${originalText}" but got "${decryptedText}"`);
    }

    console.log("INTEGRATION TEST PASSED!");
    return true;
  } catch (error) {
    console.error("INTEGRATION TEST FAILED:", error);
    return false;
  }
}
