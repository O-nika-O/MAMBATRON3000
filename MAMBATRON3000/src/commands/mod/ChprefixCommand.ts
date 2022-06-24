import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository } from "typeorm";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";

export default class ChprefixCommand extends BaseCommand {
  constructor(
    private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super("chprefix", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const checkMemberPermission =
      message.member?.permissions.has("ADMINISTRATOR");

    const changePrefix = async () => {
      const [newPrefix] = args;
      try {
        const config = client.configs.get(message.guildId!);
        const updatedConfig = await this.guildConfigRepository.save({
          ...config,
          prefix: newPrefix,
        });
        message.channel.send("Prefix updated");
        client.configs.set(message.guildId!, updatedConfig);
        console.log(config, "config");
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    if (!args.length) {
      message.channel.send("Please provide an argument");
      return;
    } else {
      checkMemberPermission ? changePrefix() : message.channel.send(
        "You need to be an administrator to use this command"
      );
    }
  }
}
