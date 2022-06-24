import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { SecretFroggyLog } from "../../typeorm/entities/SecretFroggyLog";
import { getRepository, Repository } from "typeorm";
import { PumpleLog } from "../../typeorm/entities/PumpleLog";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";

export default class CreateSecretFroggyCommand extends BaseCommand {
  constructor(
    private readonly secretRepository: Repository<SecretFroggyLog> = getRepository(
      SecretFroggyLog
    ),
    private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super("secret", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const memberId = message.author.id;
    const guildId: any = message.guild?.id;
    const [arg1, ...description] = args;

    const commands = ["create", "cancel", "set", "delete", "help"];

    const checkEventState = async (guildId: string) => {
      const state = client.configs.get(guildId)?.secretSantaEventState;
      return state;
    };

    const stateSwich = async (guildId: string, state: boolean) => {
      try {
        const config = client.configs.get(guildId);
        const updatedConfig = await this.guildConfigRepository.save({
          ...config,
          secretSantaEventState: state,
        });
        state
          ? message.channel.send(
              "A Secret Froggy Event has been initiated!\n" +
                "Use '!secret set' to get your entry to Secret Froggy"
            )
          : message.channel.send(
              "Secret Froggy Event has been cancelled, sadge"
            );
        client.configs.set(guildId, updatedConfig);
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const checkDatabaseForEntry = async (memberId: string, guildId: string) => {
      const find = await this.secretRepository.findOne({
        where: { memberId, guildId },
      });
      return find;
    };

    const postToDB = async (memberId: string) => {
      try {
        // const member = await message.guild?.members.fetch(memberId)!;
        const newSecretEntry = this.secretRepository.create({
          guildId: message.guildId!,
          issuedOn: new Date(),
          memberId,
          // memberName: member?.user.tag,
          description: description.join(" "),
        });
        await this.secretRepository.save(newSecretEntry);
        message.channel.send(
          'Your are participating in this Secret Froggy Event! peepoArrive'
        );
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const deleteCommand = async () => {
      try {
        // const member = await message.guild?.members.fetch(memberId)!;
        await this.secretRepository.remove(check!);
        message.channel.send("Secret Santa entry deleted succesfully!");
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const check = await checkDatabaseForEntry(memberId, guildId);
    const isEventActive = await checkEventState(guildId);

    if (commands.includes(arg1)) {
      //create
      if (arg1 === "create") {
        isEventActive
          ? message.channel.send(
              "Theres a Secret Froggy event already running!"
            )
          : stateSwich(guildId, true);
      }
      //cancel
      if (arg1 === "cancel") {
        isEventActive
          ? stateSwich(guildId, false)
          : message.channel.send(
              "In order to cancel a Secret Froggy event, first you need to create it!"
            );
      }

      //set
      if (arg1 === "set") {
        check
          ? message.channel.send(
              'You already have an entry to this Secret Froggy. You can use "!secret delete" if you dont want to participate anymore, sadge'
            )
          : postToDB(memberId);
      }

      //delete
      if (arg1 === "delete") {
        check
          ? deleteCommand()
          : message.channel.send(
              'You don\'t have an entry to this Secret Froggy Event. You can use "!secret set" if you want to participate, peepoArrive'
            );
      }

      // help
      if (arg1 === "help") {
        message.channel.send("luego tambien jsajdja");
      }
    } else {
      message.channel.send(
        'No command found. Arguments available: "create", "cancel", "set", "delete", "help".'
      );
    }
  }
}
