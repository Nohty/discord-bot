import { CommandInteraction, TextableChannel } from "eris";
import { BaseCommand, DiscordClient } from "../../structures";

export default class PingCommand extends BaseCommand {
  constructor() {
    super({ name: "ping", description: "Ping the bot.", type: 1 }, { timeout: 5 });
  }

  public async run(client: DiscordClient, interaction: CommandInteraction<TextableChannel>): Promise<any> {
    const delay = Math.abs(Date.now() - interaction.createdAt);
    const latency = Math.round(client.requestHandler.latencyRef.latency);

    interaction.createMessage(`Pong! Latency is \`${delay}ms\`. API Latency is \`${latency}ms\``);
  }
}
