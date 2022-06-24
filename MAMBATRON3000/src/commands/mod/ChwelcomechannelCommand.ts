import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import { getRepository } from "typeorm";

export default class ChwelcomechannelCommand extends BaseCommand {
  constructor(
    private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super("chwelcomechannel", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const checkMemberPermission =
      message.member?.permissions.has("ADMINISTRATOR");

      const changeWelcomeChannel = async () => {
      const [newChannelID] = args;
      try {
        const config = client.configs.get(message.guildId!);
        const updatedConfig = await this.guildConfigRepository.save({
          ...config,
          //here we update the channel id
          welcomeChannelId: newChannelID,
        });
        console.log(updatedConfig);
        message.channel.send("Updated welcome channel successfully");
        client.configs.set(message.guildId!, updatedConfig);
        console.log(client.configs);
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
      }
    if (!args.length) {
      message.channel.send("Please provide an argument");
    } else {
      checkMemberPermission ? changeWelcomeChannel() : message.channel.send(
        "You need to be an administrator to use this command"
      );
    }
  }
}
