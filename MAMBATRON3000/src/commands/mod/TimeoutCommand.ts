import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository, Repository } from "typeorm";
import { ModerationLog } from "../../typeorm/entities/ModerationLog";

export default class TimeoutCommand extends BaseCommand {
  constructor(
    private readonly modLogRepository: Repository<ModerationLog> = getRepository(
      ModerationLog
    )
  ) {
    super("timeout", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const checkMemberPermission =
      message.member?.permissions.has("MODERATE_MEMBERS");

    const timeoutCommand = async () => {
      const [memberId, timeoutStr, ...rest] = args;
      const reason = rest.join(" ");
      const time = parseInt(timeoutStr);
      if (isNaN(time)) {
        message.channel.send("Invalid Time");
        return;
      }
      try {
        const member = await message.guild?.members.fetch(memberId)!;
        await member.timeout(time * 1000, reason);
        const modLog = this.modLogRepository.create({
          guildId: message.guildId!,
          memberId,
          issuedBy: message.author.id,
          issuedOn: new Date(),
          reason,
          type: "timeout",
        });
        await this.modLogRepository.save(modLog);
        message.channel.send(
          `${member?.user.tag} has been timeouted for ${time} seconds.`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    if (!args.length) {
      message.channel.send(
        "Please provide the userID, time duration(seconds) and reason of timeout for arguments. Example: !ban <userID> <time> <reason>"
      );
    } else {
      checkMemberPermission
        ? timeoutCommand()
        : message.channel.send("You don't have permission to use this command");
    }
  }
}
