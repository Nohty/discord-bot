import { CipherCCMTypes, createCipheriv, randomBytes } from "crypto";

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
   */
  constructor(private _algorithm: CipherCCMTypes, private _key: string) {}

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
}
