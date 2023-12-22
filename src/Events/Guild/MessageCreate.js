import { ChannelType, Events } from "discord.js";
import { Log } from "../../Functions/index.js";

import Guild from "../../schemas/Guild.js";
import config from "../../config.js";

const cooldown = new Map();

export default {
  event: Events.MessageCreate,

  /**
   *
   * @param {import("../../Class/Client.js").default} client
   * @param {import("discord.js").Interaction} _
   */
  run: async (client, _) => {
    if (_.author.bot || _.channel.type === ChannelType.DM) return;

    if (!config.handler.commands.prefix) return;

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.enabled) {
      const guildData = await Guild.findOne({ guild: _.guildId });
      try {
        if (guildData && guildData?.prefix) prefix = guildData.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    if (!_.content.startsWith(prefix)) return;

    const args = _.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd.length) return;

    let command =
      client.collection.prefixCommands.get(cmd) ||
      client.collection.prefixCommands.get(client.collection.aliases.get(cmd));

    if (command) {
      try {
        if (command.struct?.permissions && !_.member.permissions.has(command.struct?.permissions)) {
          await _.reply({
            content:
              config.messages.noMessagePerms !== undefined &&
              config.messages.noMessagePerms !== null &&
              config.messages.noMessagePerms !== ""
                ? config.messages.noMessagePerms
                : "You don't have enough permissions to use this command.",
          });

          return;
        }

        if (command.struct?.developers) {
          if (!config.developers.includes(_.author.id)) {
            setTimeout(async () => {
              await _.reply({
                content:
                  config.messages.developer !== undefined &&
                  config.messages.developer !== null &&
                  config.messages.developer !== ""
                    ? config.messages.developer
                    : "You're not allowed to use this command.",
              });
            }, 5 * 1000);
          }

          return;
        }

        if (command.struct?.nsfw && !_.channel.nsfw) {
          await _.reply({
            content:
              config.messages.nsfw !== undefined &&
              config.messages.nsfw !== null &&
              config.messages.nsfw !== ""
                ? config.messages.nsfw
                : "This command only can be used in NSFW channels!",
          });

          return;
        }

        if (command.struct?.cooldown) {
          const cooldownFunction = () => {
            let data = cooldown.get(_.author.id);

            data.push(cmd);

            cooldown.set(_.author.id, data);

            setTimeout(() => {
              let data = cooldown.get(_.author.id);

              data = data.filter((v) => v !== cmd);

              if (data.length <= 0) {
                cooldown.delete(_.author.id);
              } else {
                cooldown.set(_.author.id, data);
              }
            }, command.struct?.cooldown);
          };

          if (cooldown.has(_.author.id)) {
            let data = cooldown.get(_.author.id);

            if (data.some((v) => v === cmd)) {
              await _.reply({
                content:
                  config.messages.cooldown !== undefined &&
                  config.messages.cooldown !== null &&
                  config.messages.cooldown !== ""
                    ? config.messages.cooldown
                    : "You're on cooldown mate!",
              });

              return;
            } else {
              cooldownFunction();
            }
          } else {
            cooldown.set(_.author.id, [cmd]);

            cooldownFunction();
          }
        }

        command.run(client, _, args);
      } catch (error) {
        Log(error, "error");
      }
    }
  },
};
