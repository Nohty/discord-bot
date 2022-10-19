import { CommandInteraction, EmbedOptions, TextableChannel } from "eris";
import { BaseCommand, DiscordClient } from "../../structures";

export default class InfoCommand extends BaseCommand {
  constructor() {
    super({ name: "info", description: "Get information about the bot.", type: 1 }, { timeout: 5 });
  }

  public async run(client: DiscordClient, interaction: CommandInteraction<TextableChannel>): Promise<any> {
    const embed: EmbedOptions = {
      author: { name: `${client.user.username}#${client.user.discriminator}`, icon_url: client.user.avatarURL },
      footer: { text: `Uptime ${this.getUpTime(client.uptime)}` },
      color: 0x0099ff,
      fields: [
        {
          name: "Version",
          value: require("../../../package.json").version,
          inline: true,
        },
        {
          name: "Library",
          value: "Eris",
          inline: true,
        },
        {
          name: "Creator",
          value: "Nohty#0001",
          inline: true,
        },
        {
          name: "Language",
          value: "TypeScript",
          inline: true,
        },
        {
          name: "Servers",
          value: client.guilds.size.toString(),
          inline: true,
        },
        {
          name: "Users",
          value: client.users.size.toString(),
          inline: true,
        },
      ],
    };

    interaction.createMessage({ embeds: [embed] });
  }

  private getUpTime(uptime: number): string {
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor((uptime / 3600000) % 24);
    const minutes = Math.floor((uptime / 60000) % 60);
    const seconds = Math.floor((uptime / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    if (seconds > 0) return `${seconds}s`;
    return "0s";
  }
}
