import { Events } from "discord.js";
import { Log } from "../../Functions/index.js";

import config from "../../config.js";

export default {
  event: Events.InteractionCreate,

  /**
   *
   * @param {import("../../Class/Client.js").default} client
   * @param {import("discord.js").Interaction} _
   */
  run: async (client, _) => {
    const componentPerms = async (component) => {
      if (component.options?.public === false && _.user.id !== _.message.interaction.user.id) {
        await _.reply({
          content:
            config.messages.noComponentPerms !== undefined &&
            config.messages.noComponentPerms !== null &&
            config.messages.noComponentPerms !== ""
              ? config.messages.noComponentPerms
              : "You don't have enough permissions to use this component.",
          ephemeral: true,
        });

        return false;
      }

      return true;
    };

    if (_.isAutocomplete()) {
      const component = client.collection.components.autoComplete.get(_.commandName);

      if (!component) return;

      try {
        component.run(client, _);
      } catch (error) {
        Log(error, "error");
      }

      return;
    }

    if (_.isButton()) {
      const component = client.collection.components.buttons.get(_.customId);

      if (!component) return;

      if (!(await componentPerms(component))) return;

      try {
        component.run(client, _);
      } catch (error) {
        Log(error, "error");
      }

      return;
    }

    if (_.isModalSubmit()) {
      const component = client.collection.components.modals.get(_.customId);

      if (!component) return;

      try {
        component.run(client, _);
      } catch (error) {
        Log(error, "error");
      }

      return;
    }

    if (_.isAnySelectMenu()) {
      const component = client.collection.components.selectMenus.get(_.customId);

      if (!component) return;

      if (!(await componentPerms(component))) return;

      try {
        component.run(client, _);
      } catch (error) {
        Log(error, "error");
      }

      return;
    }
  },
};
