import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository, Repository } from "typeorm";
import { GuildBanLog } from "../../typeorm/entities/GuildBanLog";
import { ModerationLog } from "../../typeorm/entities/ModerationLog";

export default class BanCommand extends BaseCommand {
  constructor(
    private readonly modLogRepository: Repository<ModerationLog> = getRepository(
      ModerationLog
    ),
    private readonly bansRepository: Repository<GuildBanLog> = getRepository(
      GuildBanLog
    )
  ) {
    super("ban", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const checkMemberPermission =
      message.member?.permissions.has("BAN_MEMBERS");

    const banCommand = async () => {
      const [memberId, ...rest] = args;
      const reason = rest.join(" ");
      try {
        const member = await message.guild?.members.fetch(memberId)!;
        // console.log(member?.user.tag);
        await member.ban({ reason });
        const guildModerationBan = this.modLogRepository.create({
          guildId: message.guildId!,
          issuedBy: message.author.id,
          issuedOn: new Date(),
          type: "ban",
          reason,
          memberId,
        });
        const guildBan = this.bansRepository.create({
          guildId: message.guildId!,
          bannedMemberId: memberId,
          issuedBy: message.author.id,
          issuedOn: new Date(),
          reason,
        });
        await this.modLogRepository.save(guildModerationBan);
        await this.bansRepository.save(guildBan);
        message.channel.send(
          `${member?.user.tag} has been banned from the server.`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    if (!args.length) {
      message.channel.send(
        "Please provide the userID and reason of ban for arguments. Example: !ban <userID> <reason>"
      );
    } else {
      checkMemberPermission
        ? banCommand()
        : message.channel.send("You don't have permission to ban members");
    }
  }
}
