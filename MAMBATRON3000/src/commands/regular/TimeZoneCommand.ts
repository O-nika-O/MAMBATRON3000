import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository } from "typeorm";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import ct from "countries-and-timezones";

const countries = ct.getAllCountries();

const parseCountriesToArray: any = Object.keys(countries).map((key) => {
  return countries[key as keyof typeof countries];
});

const getInfoForCountry = (country: string) => {
  return parseCountriesToArray.filter(function (el: any) {
    return el.name.toLowerCase().indexOf(country.toLowerCase()) !== -1;
  });
};

//reuse this
const allTMZ = ct.getAllTimezones();

const parseTMZToArray: any = Object.keys(allTMZ).map((key) => {
  return allTMZ[key as keyof typeof allTMZ];
});

const getInfoForTMZ = (tmz: string) => {
  return parseTMZToArray.filter(function (el: any) {
    return el.name.toLowerCase().indexOf(tmz.toLowerCase()) !== -1;
  });
};

export default class TimeZoneCommand extends BaseCommand {
  constructor(
    private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super("timeZone", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const commands = ["set", "info", "find", "help"];
    const [argument, ...argumentsForQuery] = args;

    const dataTMZ = getInfoForTMZ(argumentsForQuery.join(" "));
    const timeZones = dataTMZ.map((el: any) => {
      return el.name.toLowerCase();
    });

    const checkTMZ = timeZones.includes(
      argumentsForQuery.join(" ").toLowerCase()
    );

    const checkMemberPermission =
      message.member?.permissions.has("ADMINISTRATOR");

    const postToDB = async (tmz: string) => {
      try {
        const config = client.configs.get(message.guildId!);
        const updatedConfig = await this.guildConfigRepository.save({
          ...config,
          timeZone: tmz,
        });
        message.channel.send(
          "Bot time zone update to: " + updatedConfig?.timeZone ?? "none"
        );
        client.configs.set(message.guildId!, updatedConfig);
      } catch (err) {
        console.log(err);
        message.channel.send("Something went wrong");
      }
    };

    const filterOutput = (
      data: any,
      possibleElementsList: any,
      allElementsNumber: number,
      state: boolean
    ) => {
      const countryInfo = () => {
        const countryNames = data
          .map((el: any) => {
            return el.name;
          })
          .join("\n                 ");
        const timeZonesNames = data.map((el: any) => {
          return el.timezones.join("\n                      ");
        });
        return "Country: " + countryNames + "\nTimezones: " + timeZonesNames;
      };

      if (data.length === allElementsNumber) {
        console.log("step 1");
        state
          ? message.channel.send(
              'No timezone found. Please type a timezone\'s name right after the command: "!timeZone set <timeZone-name>". If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"'
            )
          : message.channel.send(
              'No country found. Please type a country\'s name right after the command find, just like this "!timeZone find <country-name>"'
            );
        return;
      }

      if (!data.length) {
        console.log("step 2");
        state
          ? message.channel.send(
              'No timezone found. Please type a timezone\'s name right after the command: "!timeZone set <timeZone-name>". If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"'
            )
          : message.channel.send("No country found with that name");
      } else {
        if (possibleElementsList.length > 1971) {
          console.log("step 3");
          state
            ? message.channel.send(
                'No timezone found. Please type a timezone\'s name right after the command: "!timeZone set <timeZone-name>". If you dont know any timezone for your country, look for it by typing "!timeZone find <country-name>"'
              )
            : message.channel.send(
                "Too many results, please be more specific with your search query"
              );
        }

        if (data.length > 1 && possibleElementsList.length < 1971) {
          console.log("step 4");
          message.channel.send(
            "Did you mean any of these?:\n" + possibleElementsList
          );
        }

        if (data.length === 1) {
          console.log("step 5");
          console.log(data);
          state
            ? checkTMZ
              ? postToDB(argumentsForQuery.join(" "))
              : message.channel.send("Did you mean?:\n" + possibleElementsList)
            : message.channel.send(countryInfo());
        }
      }
    };

    if (!args.length) {
      message.channel.send(
        'Please provide a valid argument: "set", "find", "info" or "help"'
      );
    } else {
      if (commands.includes(argument)) {
        //set
        if (argument === "set") {
          const possibleTMZQueryList = dataTMZ
            .map((el: any) => {
              return el.name;
            })
            .join(" **|** ");

          checkMemberPermission
            ? filterOutput(dataTMZ, possibleTMZQueryList, 378, true)
            : message.channel.send(
                "You need to be an administrator to use this command"
              );
        }

        //find
        if (argument === "find") {
          const data = getInfoForCountry(argumentsForQuery.join(" "));

          const possibleCountriesQueryList = data
            .map((el: any) => {
              return el.name;
            })
            .join(" **|** ");

          filterOutput(data, possibleCountriesQueryList, 249, false);
        }

        //info
        if (argument === "info") {
          const config = client.configs.get(message.guildId!);
          message.channel.send(
            "Bot timezone is currently set to: " + (config?.timeZone ?? "none")
          );
        }

        //help
        if (argument === "help") {
          message.channel.send("AJSjadajs de ultimo esto porqe ya me dio weba");
        }
      } else {
        message.channel.send(
          'No command found. Arguments available: "set", "find", "info".'
        );
      }
    }
  }
}
////////////////////////////////////////////////////// I WILL LEAVE THIS AS AN EXAMPLE ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// OF FETCHING DATA IN TYPESCRIPT ///////////////////////////////////////////////////////////////////////
///// import { fetchApi } from "../../utils/types";
// // export type responseApi = {
// //   message: string;
// //   zones: [
// //     {
// //       countryCode: string;
// //       countryName: string;
// //       zoneName: string;
// //       gmtOffset: number;
// //       timestamp: number;
// //     }
// //   ];
// // };

// // export type fetchApi = {
// //   data: responseApi[];
// // };
////
////
////
//// import axios from "axios";
////
//// const fetchZonesByCountry = async (country: string) => {
////   try {
////     const link1 =
////       "http://api.timezonedb.com/v2.1/list-time-zone?key=ECMYY1H4BVUD&format=json&country=" +
////       country;

////     const link2 = "http://api.timezonedb.com/v2.1/get-time-zone?key=ECMYY1H4BVUD&format=json"

////     const { data, status } = await axios.get<fetchApi>(link1);
////     console.log(JSON.stringify(data, null, 4));
////     console.log("response status is: ", status);
////     console.log(link1);
////     return data;
////   } catch (error) {
////     if (axios.isAxiosError(error)) {
////       console.log("error message: ", error.message);
////       return error.message;
////     } else {
////       console.log("unexpected error: ", error);
////       return "An unexpected error occurred";
////     }
////   }
//// };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
