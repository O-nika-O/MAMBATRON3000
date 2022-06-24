import { AudioPlayer } from "@discordjs/voice";
import {
  Collection,
  GuildMember,
  Message,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";

import ytdl = require("ytdl-core");

/**
 * Contains all the data for each song in the play song command
 */
export interface ISong {
  info: ytdl.videoInfo;
  title: string;
  url: string;
  duration: number;
  formattedDuration: string;
  member: GuildMember;
}

/**
 * Contains data for the music queue of a server
 */
export interface IServerMusicQueue {
  voiceChannel: VoiceChannel | StageChannel;
  textChannel: TextChannel;
  songs: ISong[];
  audioPlayer: AudioPlayer;
  playingMessage: Message;
  isPlaying: boolean;
  isRepeating: boolean;
}

export type Cooldown = Collection<string, number>;
