import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

import config from "../config.js";

import Commands from "../Handlers/Commands.js";
import Components from "../Handlers/Components.js";
import Deploy from "../Handlers/Deploy.js";
import Events from "../Handlers/Events.js";
import Mongoose from "../Handlers/Mongoose.js";

export default class extends Client {
  appCommands = [];

  collection = {
    aliases: new Collection(),
    prefixCommands: new Collection(),
    interactionCommands: new Collection(),
    components: {
      autoComplete: new Collection(),
      buttons: new Collection(),
      modals: new Collection(),
      selectMenus: new Collection(),
    },
  };

  constructor() {
    super({
      intents: [Object.keys(GatewayIntentBits)],
      partials: [Object.keys(Partials)],
    });
  }

  Start = async () => {
    await Commands(this);
    await Components(this);
    await Events(this);

    if (config.handler.deploy) await Deploy(this);
    if (config.handler.mongodb.enabled) await Mongoose(this);

    await this.login(process.env.BOT_TOKEN || config.client.token);
  };
}
