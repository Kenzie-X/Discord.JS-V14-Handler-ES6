// prettier-ignore
export default {
  client: {
    id: "YOUR_CLIENT_ID",
    token: "YOUR_CLIENT_TOKEN",
  },
  developers: ["DISCORD_ID_TO_USE_DEVELOPER_COMMANDS"],
  development: {
    enabled: true,
    guild: "YOUR_GUILD_ID",
  },
  handler: {
    prefix: "..",
    deploy: true,
    commands: {
      message: true,
      prefix: true,
      slash: true,
      user: true,
    },
    mongodb: {
      enabled: true,
      uri: "YOUR_MONGODB_URI",
    },
  },
  messages: {
    nsfw: "This command only can be used in NSFW channels.",
    developer: "You're not allowed to use this command.",
    cooldown: "You're on cooldown mate!",
    globalCooldown: "This command is on global cooldown mate!",
    noMessagePerms: "You don't have enough permissions to use this command.",
    noComponentPerms: "You don't have enough permissions to use this component.",
    missingDevIDs: "This command only can be used by developers.",
  },
};
