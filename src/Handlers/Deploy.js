import { REST, Routes } from "discord.js";
import { Log } from "../Functions/index.js";

import config from "../config.js";

/**
 *
 * @param {import("../Class/Client.js").default} client
 */
export default async (client) => {
  const Rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || config.client.token);

  try {
    Log("Loading application commands..", "info");

    function isSnowflake(id) {
      return /^\d+$/.test(id);
    }

    if (config.development && config.development.enabled) {
      const guildId = process.env.GUILD_ID || config.development.guild;

      if (!isSnowflake(guildId)) {
        Log("Guild ID is not a valid snowflake.", "error");
        return;
      }

      await Rest.put(Routes.applicationGuildCommands(config.client.id, guildId), {
        body: client.appCommands,
      });

      Log(`Reloaded application (/) commands for guild "${guildId}"`, "done");
    } else {
      await Rest.put(Routes.applicationCommands(config.client.id), {
        body: client.appCommands,
      });

      Log(`Reloaded application (/) commands for global`, "done");
    }
  } catch (error) {
    Log(`Error reloading application (/) commands: ${error}`, "error");
  }
};
