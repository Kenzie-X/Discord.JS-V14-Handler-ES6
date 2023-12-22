import fs from "node:fs/promises";
import { Log } from "../Functions/index.js";

/**
 *
 * @param {import("../Class/Client.js").default} client
 */
export default async (client) => {
  const dirs = await fs.readdir("./src/Components/");

  await Promise.all(
    dirs.map(async (dir) => {
      const files = await fs.readdir(`./src/Components/${dir}`);

      const importPromises = files
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          try {
            const module = (await import(`../Components/${dir}/${file}`)).default;

            if (dir === "autoComplete") {
              if (!module.commandName || !module.run) {
                Log(
                  `Error while loading component "${dir}/${file}": missing commandName or run function`,
                  "error"
                );
                return;
              }

              client.collection.components.autoComplete.set(module.commandName, module);
            } else if (dir === "buttons") {
              if (!module.customId || !module.run) {
                Log(
                  `Error while loading component "${dir}/${file}": missing customId or run function`,
                  "error"
                );
                return;
              }

              client.collection.components.buttons.set(module.customId, module);
            } else if (dir === "modals") {
              if (!module.customId || !module.run) {
                Log(
                  `Error while loading component "${dir}/${file}": missing customId or run function`,
                  "error"
                );
                return;
              }

              client.collection.components.modals.set(module.customId, module);
            } else if (dir === "selectMenus") {
              if (!module.customId || !module.run) {
                Log(
                  `Error while loading component "${dir}/${file}": missing customId or run function`,
                  "error"
                );
                return;
              }

              client.collection.components.selectMenus.set(module.customId, module);
            } else {
              Log(`Error while loading component "${dir}/${file}": Unknown component type`, "error");
              return;
            }

            Log(`Loaded component "${dir}/${file}"`, "done");
          } catch (error) {
            Log(`Error while loading component "${dir}/${file}": ${error.message}`, "error");
            return;
          }
        });

      await Promise.all(importPromises);
    })
  );
};
