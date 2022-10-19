import { ClientEvents } from "eris";
import { DiscordClient } from "./DiscordClient";

/**
 * The base event class.
 * @version 0.1.0
 * @author Nohty
 */
export abstract class BaseEvent {
  /**
   * Creates a new event.
   * @param _name The name of the event.
   * @param _options The options for the event.
   */
  constructor(private _name: keyof ClientEvents, private _options: IBaseEventOptions) {}

  /**
   * Returns the name of the event.
   */
  public get name() {
    return this._name;
  }

  /**
   * Returns the options for the event.
   */
  public get options() {
    return this._options;
  }

  /**
   * Executes the event.
   * @param client The Discord client.
   * @param args The arguments for the event.
   */
  public abstract run(client: DiscordClient, ...args: any[]): Promise<any>;
}

export interface IBaseEventOptions {
  disabled?: boolean;
  once?: boolean;
}
