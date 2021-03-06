import { Client, ClientOptions, Collection } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";
import { PumpleLog } from "../typeorm/entities/PumpleLog";
// import { Player } from "discord-player";

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = "!";
  private _configs = new Collection<string, GuildConfiguration>();
  private _bdayConfg = new Collection<string, PumpleLog>();
  private _slashCommands = new Collection<string, BaseCommand>();
  // public player = new Player(this, {
  //   ytdlOptions: {
  //     quality: "highestaudio",
  //     highWaterMark: 1 << 25,
  //   },
  // });

  constructor(options: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  get prefix(): string {
    return this._prefix;
  }
  set prefix(prefix: string) {
    this._prefix = prefix;
  }
  get configs() {
    return this._configs;
  }
  set configs(guildConfigs: Collection<string, GuildConfiguration>) {
    this._configs = guildConfigs;
  }
  get bdayConfg() {
    return this._bdayConfg;
  }
  set bdayConfg(bdayConfigs: Collection<string, PumpleLog>) {
    this._bdayConfg = bdayConfigs;
  }

  // get slashCommands(): Collection<string, BaseCommand> {
  //   return this._slashCommands;
  // }

  // set slashCommands(slashCommands: Collection<string, BaseCommand>) {
  //   this._slashCommands = slashCommands;
  // }
}
