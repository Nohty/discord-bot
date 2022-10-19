import { CommandInteraction, UnknownInteraction } from "eris";
import { BaseEvent, DiscordClient } from "../structures";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate", {});
  }

  public async run(client: DiscordClient, interaction: UnknownInteraction): Promise<any> {
    if (interaction instanceof CommandInteraction) {
      const command = client.commands.get(interaction.data.name);

      if (command) {
        const { permissions } = command;
        if (permissions.disabled) return;

        command.run(client, interaction);
      }
    }
  }
}
