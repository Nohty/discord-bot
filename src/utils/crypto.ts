import { CipherCCMTypes, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { toBuffer } from "qrcode";
import { GeneratedSecret, generateSecret } from "speakeasy";

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

  public create2FAKey(): GeneratedSecret {
    return generateSecret({ name: this._name });
  }

  public createQR(secret: GeneratedSecret): Promise<Buffer> {
    return toBuffer(secret.otpauth_url!);
  }
}
