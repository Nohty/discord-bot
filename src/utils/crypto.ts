import { CipherCCMTypes, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import speakeasy, { GeneratedSecret } from "speakeasy";
import { toBuffer } from "qrcode";

/**
 * A class for encrypting and decrypting data.
 * And for generating a secret key and a QR code for the secret key.
 * @version 0.1.0
 * @author Nohty
 */
export class Crypto {
  /**
   * Creates a new instance of the Crypto class.
   * @param _algorithm The algorithm to use.
   * @param _key The key to use.
   * @param _name The name used for the 2FA key.
   */
  constructor(private _algorithm: CipherCCMTypes, private _key: string, private _name: string) {}

  /**
   * Returns the algorithm used.
   */
  public get algorithm() {
    return this._algorithm;
  }

  /**
   * Returns the key used.
   */
  public get key() {
    return this._key;
  }

  /**
   * Returns the name for the 2FA key.
   */
  public get name() {
    return this._name;
  }

  /**
   * Encrypts a string with a random IV and the key.
   * @param text The text to encrypt.
   * @returns The encrypted text.
   */
  public encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this._algorithm, Buffer.from(this._key), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  /**
   * Decrypts a string with the key.
   * @param text The text to decrypt.
   * @returns The decrypted text.
   */
  public decrypt(text: string): string {
    const textParts = text.split(":");
    if (textParts.length !== 2) throw new Error("Invalid cipher text.");

    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = Buffer.from(textParts[1], "hex");

    const decipher = createDecipheriv(this._algorithm, Buffer.from(this._key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  /**
   * Generates a secret key.
   * @returns A random string of length 16.
   */
  public create2FAKey(): GeneratedSecret {
    return speakeasy.generateSecret({ name: this._name });
  }

  /**
   * Generates a QR code for the secret key.
   * @param secret The secret key
   * @returns A QR code for the secret key.
   */
  public createQR(secret: GeneratedSecret): Promise<Buffer> {
    return toBuffer(secret.otpauth_url!);
  }

  /**
   * Generates a TOTP token for the secret key.
   * @param secret The secret key
   * @param code The code to verify
   * @returns Whether the code is valid or not
   */
  public verify2FA(secret: string, code: string): boolean {
    return speakeasy.totp.verify({ secret, encoding: "ascii", token: code });
  }
}
