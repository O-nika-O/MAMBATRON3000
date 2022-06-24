require("dotenv").config();
import * as fs from "fs";
import "reflect-metadata";
import { Routes } from "discord-api-types/v9";
import { registerCommands, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
import { Collection, Intents } from "discord.js";
import { createConnection, getRepository } from "typeorm";
import { GuildConfiguration } from "./typeorm/entities/GuildConfiguration";
import { io } from "socket.io-client";
import { entities } from "./typeorm/entities";
import { REST } from "@discordjs/rest";

const TOKEN: string = process.env.DISCORD_BOT_TOKEN!;

const client = new DiscordClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    // Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

(async () => {
  const socket = io("http://localhost:3001");

  socket.on("guildPrefixUpdate", (config: GuildConfiguration) => {
    console.log("guildPrefixUpdate");
    console.log(config);
    console.log(client.configs);
    client.configs.set(config.guildId, config);
    console.log(client.configs);
  });

  await createConnection({
    type: "mysql",
    host: process.env.MYSQL_DB_HOST,
    port: 3306,
    username: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    synchronize: true,
    entities: entities,
  });

  const configRepo = getRepository(GuildConfiguration);
  //finds every single guild config
  const guildConfigs = await configRepo.find();
  const configs = new Collection<string, GuildConfiguration>();
  guildConfigs.forEach((config) => configs.set(config.guildId, config));

  client.configs = configs;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");

  await client.login(TOKEN);
})();
