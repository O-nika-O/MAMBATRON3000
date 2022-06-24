import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";
import { TextChannel } from "discord.js";
import { getRepository } from "typeorm";
import { PumpleLog } from "../../typeorm/entities/PumpleLog";
import { utcToZonedTime, getTimezoneOffset } from "date-fns-tz";

export default class ReadyEvent extends BaseEvent {
  constructor(private readonly memberPumRepository = getRepository(PumpleLog)) {
    super("ready");
  }
  async run(client: DiscordClient) {
    console.log("Bot has logged in.");

    const allGuildIds = () =>
      client.configs.map((el) => {
        return el.guildId;
      });

    // const getGuildConfig = (guildId: string) =>
    //   client.configs.find((GuildConfiguration) => {
    //     return GuildConfiguration.guildId === guildId;
    //   });

    const getBdays = async () => {
      const bdaysList = await Promise.all(
        allGuildIds().map((guild_id) => {
          const checkDatabaseForEntry = async (guildId: string) => {
            return await this.memberPumRepository.find({
              where: { guildId },
            });
          };
          return checkDatabaseForEntry(guild_id);
        })
      ).then((el) => {
        const parsePumpleObjectToAny: any = Object.keys(el).map((key) => {
          return el[key as keyof typeof el];
        });

        return parsePumpleObjectToAny;
      });
      return bdaysList;
    };

    const baseClock = () => {
      const isoDate = new Date().toISOString();
      const kiritimatiDate = utcToZonedTime(isoDate, "Pacific/Kiritimati");
      const yearIsLeap = kiritimatiDate.getFullYear() % 4 === 0;
      const baseDate = kiritimatiDate.getDate();
      const baseMonth = kiritimatiDate.getMonth() + 1;
      const dayOfTheweek = kiritimatiDate.getDay();
      const baseHour = kiritimatiDate.getHours();
      const baseMinute = kiritimatiDate.getMinutes();

      return {
        yearIsLeap,
        baseDate,
        baseMonth,
        dayOfTheweek,
        baseHour,
        baseMinute,
      };
    };

    const monthsFilter = (
      yearIsLeap: boolean,
      baseMonth: number,
      baseDate: number
    ) => {
      const monthIsFebruary = baseMonth === 2;
      const monthHas30Days = [4, 6, 9, 11];
      const daysLeftInMonth =
        (monthIsFebruary
          ? yearIsLeap
            ? 29
            : 28
          : monthHas30Days.includes(baseMonth)
          ? 30
          : 31) - baseDate;
      return { daysLeftInMonth };
    };

    const getBdaysOfTheMonth = async (thisMonth: boolean) => {
      let bdaysOfTheMonth: any = [];
      const scanPumples = await getBdays();
      scanPumples.forEach((element: any) => {
        const { baseDate, baseMonth } = baseClock();
        element.map((element: any) => {
          const date: string = element.bdayDate;
          const guildId: string = element.guildId;
          const [cumDay, cumMonth] = date.split("/", 2);
          const dayInt = parseInt(cumDay);
          const monthInt = parseInt(cumMonth);

          const memberId = element.memberId;
          // const guildTimeZone = getGuildConfig(guildId)?.timeZone;
          const guildTimeZone = client.configs.get(guildId)?.timeZone;
          const memberTimeZone = element.timeZone;
          const isInTheVeryNextDay = baseDate + 1 === dayInt;
          const whatMonthIsThis =
            monthInt === (thisMonth ? baseMonth : baseMonth + 1);
          whatMonthIsThis
            ? bdaysOfTheMonth.push({
                guildId,
                memberId,
                memberTimeZone,
                guildTimeZone,
                dayInt,
                isInTheVeryNextDay,
              })
            : null;
        });
      });
      return bdaysOfTheMonth;
    };

    const getBdaysOfTheWeek = async (userDateChoice: number) => {
      const { yearIsLeap, baseDate, baseMonth, dayOfTheweek } = baseClock();
      const endOfWeek = baseDate + 6;
      const { daysLeftInMonth } = monthsFilter(yearIsLeap, baseMonth, baseDate);

      const daysNeededFromNextMonth = 6 - daysLeftInMonth;
      const doTheWeekEndsNextMonth = daysNeededFromNextMonth > 0; // endOfWeek is larger than days in the month

      let bdaysOfTheWeek: any = [];
      if (dayOfTheweek === userDateChoice) {
        const thisMonthData = (await getBdaysOfTheMonth(true)) as any;

        const pushBdaysToArray = async (month: boolean) => {
          if (!month) {
            thisMonthData.forEach((element: any) => {
              if (baseDate <= element.dayInt && element.dayInt <= endOfWeek) {
                bdaysOfTheWeek.push(element);
              }
            });
          } else {
            const nextMonthData = (await getBdaysOfTheMonth(false)) as any;
            thisMonthData.forEach((element: any) => {
              if (baseDate <= element.dayInt) {
                bdaysOfTheWeek.push(element);
              }
            });
            nextMonthData.forEach((element: any) => {
              if (element.dayInt <= daysNeededFromNextMonth) {
                bdaysOfTheWeek.push(element);
              }
            });
          }
        };
        doTheWeekEndsNextMonth
          ? pushBdaysToArray(true)
          : pushBdaysToArray(false);
      }

      return bdaysOfTheWeek;
    };

    let bdayScheduler = [] as any;

    const bdayIsComing = async () => {
      const dayOfTheweek = baseClock().dayOfTheweek;
      const weekbdays = await getBdaysOfTheWeek(dayOfTheweek);
      const preparedBdays = weekbdays.map((element: any) => {
        if (
          element.isInTheVeryNextDay ||
          element.dayInt === baseClock().baseDate
        ) {
          //3600000 is the number of milliseconds in an hour, divide the offset by this number to get the number of hours
          const bDayOffset = getTimezoneOffset(element.memberTimeZone);
          const baseMinutesOffsetMinusUTCOffset = 840 - bDayOffset / 60000;
          const newData = {
            ...element,
            offsetMinutes: baseMinutesOffsetMinusUTCOffset,
          };
          const checkForSameEntry = bdayScheduler.find((el: any) => {
            return (
              el.memberId === element.memberId && el.guildId === element.guildId
            );
          });
          if (checkForSameEntry === undefined) {
            bdayScheduler.push(newData);
          } else {
            console.log("already exists");
          }
          return newData;
        } else {
          return null;
        }
      });
      const filteredBdays = preparedBdays.filter((el: any) => {
        return el !== null;
      });
      return filteredBdays;
    };

    const cleanUp = (element: any) => {
      bdayScheduler.splice(bdayScheduler.indexOf(element), 1);
    };

    const monitorScheduler = async () => {
      const filteredArray = (await bdayIsComing()) as any;
      console.log("++++++++++START++++++++++");
      console.log(
        filteredArray,
        "filtered list",
        filteredArray.length,
        "entries"
      );

      bdayScheduler.forEach((scheduled: any) => {
        filteredArray.forEach((rawList: any) => {
          if (
            rawList.memberId === scheduled.memberId &&
            rawList.guildId === scheduled.guildId
          ) {
            if (
              rawList.memberTimeZone !== scheduled.memberTimeZone ||
              rawList.dayInt !== scheduled.dayInt ||
              rawList.guildTimeZone !== scheduled.guildTimeZone
            ) {
              console.log("timezone or day changed");
              const index = bdayScheduler.findIndex((el: any) => {
                return (
                  el.memberId === rawList.memberId &&
                  el.guildId === rawList.guildId
                );
              });
              cleanUp(index);
              bdayScheduler.push(rawList);
            }
          }
          const checkEntriesForDeletion = filteredArray.find((element: any) => {
            return (
              element.memberId === scheduled.memberId &&
              element.guildId === scheduled.guildId
            );
          });

          if (checkEntriesForDeletion === undefined) {
            cleanUp(scheduled);
            console.log("deleted entry");
          }
        });
      });

      console.log(
        bdayScheduler,
        "bdayScheduler",
        bdayScheduler.length,
        "number of entries"
      );
      console.log("++++++++++FINISH++++++++++");
    };

    const sendMessageToChannel = async (channelId: string, element: any) => {
      const channel = client.channels.cache.get(
        channelId as string
      ) as TextChannel;
      try {
        // const guild = client.guilds.cache.get(element.guildId);
        const member = await client.users.fetch(element.memberId);
        channel.send(`${member} hello fucker`);
      } catch (error) {
        console.log(error);
      }
      cleanUp(element);
    };

    const tick = () => {
      const { baseDate, baseHour, baseMinute } = baseClock();

      bdayScheduler.forEach((element: any) => {
        const hoursLeftToBday = element.offsetMinutes / 60;
        const moreThan24hrsHaveElapsed = hoursLeftToBday >= 24;
        const hoursLeftToBdayAfter24hrs = hoursLeftToBday - 24;
        const changeOfMonth = baseDate == 1 && baseHour < 4;

        const sortAndSend = (value: boolean) => {
          const isItToday =
            (value
              ? element.dayInt
              : changeOfMonth
              ? 1
              : element.dayInt + 1) === baseDate;
          const isItTheTime =
            (value ? hoursLeftToBday : hoursLeftToBdayAfter24hrs) === baseHour;
          const itIsNow = isItToday && isItTheTime;
          const channelId = client.configs.get(
            element.guildId
          )?.welcomeChannelId; // just change it to pum bday channel

          if (!Number.isInteger(hoursLeftToBday)) {
            const minutesWeNeedToAdd =
              element.offsetMinutes -
              Math.floor(value ? hoursLeftToBday : hoursLeftToBdayAfter24hrs) *
                60;
            const minutesMarkReady = minutesWeNeedToAdd > baseMinute;
            itIsNow && minutesMarkReady
              ? channelId
                ? sendMessageToChannel(channelId, element)
                : null
              : null;
          } else {
            itIsNow
              ? channelId
                ? sendMessageToChannel(channelId, element)
                : null
              : null;
          }
        };
        sortAndSend(!moreThan24hrsHaveElapsed);
      });
    };

    // bdayIsComing();
    // setInterval(() => monitorScheduler(), 5000);
    //use this time 900000 above
    // setInterval(() => tick(), 15000);

    // const toiletBroId = "213857348433739776";
    // const demoChId = "965997420049752094";
    // const demoEle = {
    //   guildId: "965996267463401492",
    //   memberId: "877972903117873194",
    //   memberTimeZone: "america/merida",
    //   guildTimeZone: "America/Merida",
    //   dayInt: 6,
    //   isInTheVeryNextDay: false,
    //   offsetMinutes: 1140,
    // };

    // sendMessageToChannel(demoChId, demoEle);
  }
}
