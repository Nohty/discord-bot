import { Client, ClientOptions } from "eris";
import { BaseCommand } from "./BaseCommand";

export class DiscordClient extends Client {
  private _commands = new Map<string, BaseCommand>();

  constructor(token: string, options: ClientOptions) {
    super(token, options);
  }

  public get commands(): Map<string, BaseCommand> {
    return this._commands;
  }
}
