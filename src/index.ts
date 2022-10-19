import "dotenv/config";
import { join } from "path";
import { DiscordClient } from "./structures";
import { registerCommands, registerEvents, syncCommands } from "./utils";

const client = new DiscordClient(process.env.DISCORD_BOT_TOKEN, {
  intents: ["guilds", "guildMessages"],
});

(async () => {
  await registerCommands(client, join(__dirname, "commands"));
  await registerEvents(client, join(__dirname, "events"));
  await syncCommands(client);

  client.connect();
})();
