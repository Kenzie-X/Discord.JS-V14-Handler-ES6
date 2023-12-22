import fs from "node:fs/promises";
import { Log } from "../Functions/index.js";

/**
 *
 * @param {import("../Class/Client.js").default} client
 */
export default async (client) => {
  const dirs = await fs.readdir("./src/Events/");

  await Promise.all(
    dirs.map(async (dir) => {
      const files = await fs.readdir(`./src/Events/${dir}`);

      const importPromises = files
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          try {
            const module = (await import(`../Events/${dir}/${file}`)).default;

            if (!module.event || !module.run) {
              Log(`Error while loading event "${dir}/${file}": missing event or run function`, "error");
              return;
            }

            if (module.once) {
              client.once(module.event, (...args) => module.run(client, ...args));
            } else {
              client.on(module.event, (...args) => module.run(client, ...args));
            }

            Log(`Loaded event "${dir}/${file}"`, "done");
          } catch (error) {
            Log(`Error while loading event "${dir}/${file}": ${error.message}`, "error");
            return;
          }
        });

      await Promise.all(importPromises);
    })
  );
};
