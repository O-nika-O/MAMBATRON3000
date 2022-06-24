import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository, Repository } from "typeorm";
import { PumpleLog } from "../../typeorm/entities/PumpleLog";
import ct from "countries-and-timezones";

const allTMZ = ct.getAllTimezones();

const parseTMZToArray: any = Object.keys(allTMZ).map((key) => {
  return allTMZ[key as keyof typeof allTMZ];
});

const getInfoForTMZ = (tmz: string) => {
  return parseTMZToArray.filter(function (el: any) {
    return el.name.toLowerCase().indexOf(tmz.toLowerCase()) !== -1;
  });
};

export default class PumpleCommand extends BaseCommand {
  constructor(
    private readonly cumRepository: Repository<PumpleLog> = getRepository(
      PumpleLog
    )
  ) {
    super("pum", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const memberId = message.author.id;
    const guildId: any = message.guild?.id;
    const [arg1, cumDate, ...argTMZ] = args;

    const commands = ["set", "forget", "info", "help"];
    const dataTMZ = getInfoForTMZ(argTMZ.join(" "));
    const timeZones = dataTMZ.map((el: any) => {
      return el.name.toLowerCase();
    });
    const checkTMZ = timeZones.includes(argTMZ.join(" ").toLowerCase());

    const checkDatabaseForEntry = async (memberId: string, guildId: string) => {
      const cum = await this.cumRepository.findOne({
        where: { memberId, guildId },
      });
      return cum;
    };

    const check = await checkDatabaseForEntry(memberId, guildId);

    const postToDB = async (
      memberId: string,
      bdayDate: string,
      timeZone?: string
    ) => {
      try {
        const member = await message.guild?.members.fetch(memberId)!;
        const cumEntry = this.cumRepository.create({
          guildId: message.guildId!,
          issuedOn: new Date(),
          memberId,
          memberName: member?.user.tag,
          bdayDate: bdayDate,
          timeZone: timeZone,
        });
        await this.cumRepository.save(cumEntry);
        timeZone
          ? message.channel.send(
              `Birthday date(${cumEntry.bdayDate}) and timezone(${cumEntry.timeZone}) set succesfully!`
            )
          : message.channel.send(
              `Birthday date(${cumEntry.bdayDate}) set succesfully! No timezone were set though. You can look for a timezone by typing "!timeZone find <your timezone>". Then delete your birthday date by typing "!pum forget". And finally set it again by typing "!pum set <DD/MM> <your-timezone>". Dont forget your timezone this time dummmy!`
            );
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const dateFilter = async () => {
      const [cumDay, cumMonth] = cumDate.split("/", 2);
      const bdayDate = `${cumDay}/${cumMonth}`;
      const dayInt = parseInt(cumDay);
      const monthInt = parseInt(cumMonth);
      const checkDay = dayInt < 32 && dayInt > 0;
      const checkMonth = monthInt < 13 && monthInt > 0;
      const monthIsFebruary = monthInt === 2;
      const monthHas30Days = [4, 6, 9, 11];

      if (
        typeof dayInt == "number" &&
        typeof monthInt == "number" &&
        checkDay &&
        checkMonth
      ) {
        if (
          //CHECK THE FOLLOWING LINE BEFORE DEPLOYING
          (monthHas30Days.includes(monthInt) && dayInt > 30) ||
          (monthIsFebruary && dayInt > 29)
        ) {
          message.channel.send(
            "Please provide a valid date in the format DD/MM"
          );
          return;
        }

        console.log(argTMZ);
        console.log(checkTMZ);
        !argTMZ.length
          ? postToDB(memberId, bdayDate)
          : filterOutput(memberId, bdayDate, argTMZ.join(" "));
      } else {
        console.log(checkDay, checkMonth)
        message.channel.send("Please provide a valid date in the format DD/MM");
        return;
      }
    };

    const forgetCommand = async () => {
      try {
        // const member = await message.guild?.members.fetch(memberId)!;
        await this.cumRepository.remove(check!);
        message.channel.send("Birthday date deleted succesfully!");
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const filterOutput = (memberId: any, bdayDate: any, argumentsTMZ: any) => {
      const possibleElementsList = dataTMZ
        .map((el: any) => {
          return el.name;
        })
        .join(" **|** ");

      const errorMessage =
        'No timezone found. Please type a timezone\'s name right after the command: "!pum set <DD/MM> <timeZone-name>". If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"';

      if (dataTMZ.length === 378) {
        console.log("step 1");
        message.channel.send(errorMessage);

        return;
      }

      if (!dataTMZ.length) {
        console.log("step 2");
        message.channel.send(errorMessage);
      } else {
        if (possibleElementsList.length > 1971) {
          console.log("step 3");
          message.channel.send(errorMessage);
        }

        if (dataTMZ.length > 1 && possibleElementsList.length < 1971) {
          console.log("step 4");
          message.channel.send(
            "Did you mean any of these?:\n" + possibleElementsList
          );
        }

        if (dataTMZ.length === 1) {
          console.log("step 5");
          checkTMZ
            ? postToDB(memberId, bdayDate, argumentsTMZ) //memberId, bdayDate, argTMZ.join(" ")
            : message.channel.send(
                'Please provide a valid argument. Example: !pum set <DD/MM> <timezone>. If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"'
              );
        }
      }
    };

    if (commands.includes(arg1)) {
      //set
      if (arg1 === "set") {
        check
          ? message.channel.send(
              'You already have a birthday date set! You can remove it though. Use "!pum forget", then set it again.'
            )
          : cumDate
          ? dateFilter()
          : message.channel.send(
              "Please provide a valid argument. Example: !pum set <DD/MM> <timezone>. You can search for your timezone by typing '!timeZone find <country-name>'"
            );
      }

      //forget
      if (arg1 === "forget") {
        check
          ? forgetCommand()
          : message.channel.send(
              'You don\'t have a birthday date set! You can set it though. Use "!pum set DD/MM <your-timezone>". If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"'
            );
      }

      //info
      if (arg1 === "info") {
        const urBDAY = check?.bdayDate;
        const urTMZ = check?.timeZone;

        check
          ? message.channel.send(
              "Your birthday date is " +
                urBDAY +
                " and your timezone is " +
                (urTMZ ?? 'not set. You can look for a timezone by typing "!timeZone find <your timezone>". Then delete your birthday date by typing "!pum forget". And finally set it again by typing "!pum set <DD/MM> <your-timezone>". Dont forget your timezone this time dummmy!')
            )
          : message.channel.send(
              "Please provide a valid argument. Example: !pum set <DD/MM> <timezone>. You can search for your timezone by typing '!timeZone find <country-name>'"
            );
      }

      //help
      if (arg1 === "help") {
        message.channel.send("luego tambien jsajdja");
      }
    } else {
      message.channel.send(
        'No command found. Arguments available: "set", "forget", "info", "help".'
      );
    }
  }
}
