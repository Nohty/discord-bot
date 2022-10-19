import { readdir } from "fs/promises";
import { join } from "path";
import { BaseCommand, DiscordClient } from "../structures";

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

type ClassType = "event" | "command";
