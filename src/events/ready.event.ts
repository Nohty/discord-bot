import { BaseEvent, DiscordClient } from "../structures";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready", { once: true });
  }

  public async run(client: DiscordClient): Promise<any> {
    console.log(`Bot has logged in as ${client.user.username}#${client.user.discriminator}!`);
    client.editStatus("online", { name: "with TypeScript", type: 0 });
  }
}
