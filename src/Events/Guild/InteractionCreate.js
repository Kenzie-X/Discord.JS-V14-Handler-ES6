import { Events } from "discord.js";
import { Log } from "../../Functions/index.js";

import config from "../../config.js";

const cooldown = new Map();

export default {
  event: Events.InteractionCreate,

  /**
   *
   * @param {import("../../Class/Client.js").default} client
   * @param {import("discord.js").Interaction} _
   */
  run: async (client, _) => {
    if (!_.isCommand()) return;

    if (config.handler.commands.message === false && _.isMessageContextMenuCommand()) return;
    if (config.handler.commands.slash === false && _.isChatInputCommand()) return;
    if (config.handler.commands.user === false && _.isUserContextMenuCommand()) return;

    const command = client.collection.interactionCommands.get(_.commandName);

    if (!command) return;

    try {
      if (command.options?.nsfw && !_.channel.nsfw) {
        await _.reply({
          content:
            config.messages.nsfw !== undefined && config.messages.nsfw !== null && config.messages.nsfw !== ""
              ? config.messages.nsfw
              : "The current channel is not a NSFW channel",
          ephemeral: true,
        });

        return;
      }

      if (command.options?.developers) {
        if (config.developers?.length > 0 && !config.developers?.includes(_.user.id)) {
          await _.reply({
            content:
              config.messages.developer !== undefined &&
              config.messages.developer !== null &&
              config.messages.developer !== ""
                ? config.messages.developer
                : "You're not allowed to use this command.",
            ephemeral: true,
          });

          return;
        } else if (config.developers?.length <= 0) {
          await _.reply({
            content:
              config.messages.missingDevIDs !== undefined &&
              config.messages.missingDevIDs !== null &&
              config.messages.missingDevIDs !== ""
                ? config.messages.missingDevIDs
                : "This command only can be used by developers!",
            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.cooldown) {
        const isGlobalCooldown = command.options.globalCooldown;
        const cooldownKey = isGlobalCooldown ? "global_" + command.struct.name : _.user.id;

        const cooldownFunction = () => {
          let data = cooldown.get(cooldownKey);

          data.push(_.commandName);

          cooldown.set(cooldownKey, data);

          setTimeout(() => {
            let data = cooldown.get(cooldownKey);

            data = data.filter((v) => v !== _.commandName);

            if (data.length <= 0) {
              cooldown.delete(cooldownKey);
            } else {
              cooldown.set(cooldownKey, data);
            }
          }, command.options.cooldown);
        };

        if (cooldown.has(cooldownKey)) {
          let data = cooldown.get(cooldownKey);

          if (data.some((v) => v === _.commandName)) {
            const cooldownMessage = isGlobalCooldown
              ? config.messages.globalCooldown ?? "This command is on global cooldown mate!"
              : config.messages.cooldown ?? "You're on cooldown mate!";

            await _.reply({
              content: cooldownMessage,
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(cooldownKey, [_.commandName]);
          cooldownFunction();
        }
      }

      command.run(client, _);
    } catch (error) {
      Log(error, "error");
    }
  },
};
