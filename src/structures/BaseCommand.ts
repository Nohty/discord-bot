import { ChatInputApplicationCommandStructure, CommandInteraction } from "eris";
import { DiscordClient } from "./DiscordClient";

/**
 * The base command class.
 * @version 0.1.0
 * @author Nohty
 */
export abstract class BaseCommand {
  /**
   * Creates a new command.
   * @param _command The command structure.
   * @param _permissions The permissions for the command.
   */
  constructor(private _command: ChatInputApplicationCommandStructure, private _options: IBaseCommandOptions) {}

  /**
   * Returns the command structure.
   */
  public get command() {
    return this._command;
  }

  /**
   * Returns the permissions for the command.
   */
  public get options() {
    return this._options;
  }

  /**
   * Executes the command.
   * @param client The Discord client.
   * @param interaction The CommandInteraction.
   */
  public abstract run(client: DiscordClient, interaction: CommandInteraction): Promise<any>;
}

export interface IBaseCommandOptions {
  disabled?: boolean;
  timeout?: number;
  permissions?: "everyone" | "moderator" | "admin" | "owner";
  customPermissions?: IBaseCommandPermissions;
}

export interface IBaseCommandPermissions {
  id: string;
  type: "USER" | "ROLE";
  permission: boolean;
}
