import { readdir } from "fs/promises";
import { join } from "path";
import { BaseCommand, BaseEvent, DiscordClient } from "../structures";

/**
 * Locates all classes in the given directory.
 * @param type The type of class to locate.
 * @param dir The directory to search.
 * @returns A list of classes.
 */
async function locateClasses<T>(type: ClassType, dir: string): Promise<T[]> {
  const files = await readdir(dir, { withFileTypes: true });
  const classes: T[] = [];

  for (const file of files) {
    if (file.isDirectory()) classes.push(...(await locateClasses<T>(type, join(dir, file.name))));
    if (file.name.endsWith(`.${type}.js`) || file.name.endsWith(`.${type}.ts`)) {
      try {
        classes.push(new (await import(join(dir, file.name))).default());
      } catch (error) {}
    }
  }

  return classes;
}

/**
 * Registers all commands in the given directory.
 * @param client The client to register the commands to.
 * @param dir The directory to search for commands.
 */
export async function registerCommands(client: DiscordClient, dir: string) {
  const commands = await locateClasses<BaseCommand>("command", dir);

  for (const command of commands) {
    client.commands.set(command.command.name, command);
  }
}

/**
 * Registers all events in the given directory.
 * @param client The client to register the events to.
 * @param dir The directory to search for commands.
 */
export async function registerEvents(client: DiscordClient, dir: string) {
  const events = await locateClasses<BaseEvent>("event", dir);

  for (const event of events) {
    if (event.options.once) client.once(event.name, event.run.bind(event, client));
    else client.on(event.name, event.run.bind(event, client));
  }
}

/**
 * Syncs the commands with the Discord API.
 * @param client The client to register the slash commands to.
 */
export async function syncCommands(client: DiscordClient) {
  const guilds = client.guilds.values();

  for (const guild of guilds) {
    const commands = await client.getGuildCommands(guild.id);
    console.log(`[DEV] Checking commands for ${guild.name}...`);

    for (const command of commands) {
      if (!client.commands.has(command.name)) {
        console.log(`[DEV] Command ${command.name} in guild ${guild.name} is not registered, deleting...`);
        await client.deleteGuildCommand(guild.id, command.id);
      }
    }

    for (const command of client.commands.values()) {
      const registeredCommand = commands.find((c) => c.name === command.command.name);

      if (!registeredCommand) {
        console.log(`[DEV]  Command ${command.command.name} is not registered in guild ${guild.name}, registering...`);
        await client.createGuildCommand(guild.id, command.command);
      }

      if (registeredCommand && command.command.description !== registeredCommand.description) {
        console.log(`[DEV] Command ${command.command.name} in guild ${guild.name} is outdated, updating...`);
        await client.editGuildCommand(guild.id, registeredCommand.id, command.command);
      }
    }
  }
}

type ClassType = "event" | "command";
