import { Client, ClientOptions } from "eris";
import { Crypto } from "../utils";
import { BaseCommand } from "./BaseCommand";

export class DiscordClient extends Client {
  private _commands = new Map<string, BaseCommand>();
  private _crypto = new Crypto("aes-256-ccm", process.env.CYPHER_KEY, "Test");

  constructor(token: string, options: ClientOptions) {
    super(token, options);
  }

  public get commands(): Map<string, BaseCommand> {
    return this._commands;
  }

  public get crypto() {
    return this._crypto;
  }
}
