import { ActivityType, Events } from "discord.js";
import { Log } from "../../Functions/index.js";

export default {
  event: Events.ClientReady,

  /**
   *
   * @param {import("../../Class/Client.js").default} client
   * @param {import("discord.js").Interaction} _
   */
  run: async (client, _) => {
    client.user.setPresence({
      status: "idle",
      activities: [
        {
          name: "X-Project",
          type: ActivityType.Watching,
        },
      ],
    });

    Log(`Logged in as "${client.user.tag}"!`, "done");
  },
};
