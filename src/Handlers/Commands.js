import fs from "node:fs/promises";
import { Log } from "../Functions/index.js";

/**
 *
 * @param {import("../Class/Client.js").default} client
 */
export default async (client) => {
  const types = await fs.readdir("./src/Commands/");

  await Promise.all(
    types.map(async (type) => {
      const dirs = await fs.readdir(`./src/Commands/${type}`);

      await Promise.all(
        dirs.map(async (dir) => {
          const files = await fs.readdir(`./src/Commands/${type}/${dir}`);

          const importPromises = files
            .filter((file) => file.endsWith(".js"))
            .map(async (file) => {
              try {
                const module = (await import(`../Commands/${type}/${dir}/${file}`)).default;

                if (!module.struct?.name || !module.run) {
                  Log(
                    `Error while loading command "${type}/${dir}/${file}": missing struct:\\name or run function`,
                    "error"
                  );
                  return;
                }

                if (type === "Prefix") {
                  client.collection.prefixCommands.set(module.struct.name, module);

                  if (module.struct.aliases && Array.isArray(module.struct.aliases)) {
                    module.struct.aliases.forEach((alias) => {
                      client.collection.aliases.set(alias, module.struct.name);
                    });
                  }
                } else if (type === "Message" || type === "Slash" || type === "User") {
                  client.collection.interactionCommands.set(module.struct.name, module);
                  client.appCommands.push(module.struct);
                } else {
                  Log(`Error while loading command "${type}/${dir}/${file}": Unknown command type`, "error");
                  return;
                }

                Log(`Loaded command "${type}/${dir}/${file}"`, "done");
              } catch (error) {
                Log(`Error while loading command "${type}/${dir}/${file}": ${error.message}`, "error");
                return;
              }
            });

          await Promise.all(importPromises);
        })
      );
    })
  );
};
