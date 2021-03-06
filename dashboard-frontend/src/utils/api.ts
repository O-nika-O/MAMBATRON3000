import axios, { AxiosRequestConfig } from "axios";
import {
  GuildModLogType,
  GuildConfigType,
  PartialGuild,
  User,
  GuildBanType,
} from "./types";

const CONFIG: AxiosRequestConfig = { withCredentials: true };
const API_URL = 'http://localhost:3001/api';

export const getAuthStatus = () =>
  axios.get<User>(`${API_URL}/auth/status`, CONFIG);

export const getMutualGuilds = () =>
  axios.get<PartialGuild[]>(`${API_URL}/discord/guilds`, CONFIG);

export const getGuildConfig = (guildId: string) =>
  axios.get<GuildConfigType>(`${API_URL}/guilds/config/${guildId}`, CONFIG);

export const updateGuildPrefix = (guildId: string, prefix: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/prefix`,
    {
      prefix,
    },
    CONFIG
  );

export const getGuildChannels = (guildId: string) =>
  axios.get(`${API_URL}/discord/guilds/${guildId}/channels`, CONFIG);

export const updateWelcomeChannelId = (guildId: string, channelId: string, message: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/welcome`,
    {
      channelId,
      message,
    },
    CONFIG
  );

export const updateBdayChannelId = (guildId: string, channelId: string, message: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/bday`,
    {
      channelId,
      message,
    },
    CONFIG
  );
    
export const getGuildBanLogs = (guildId: string, fromDate: string) =>
  axios.get<GuildModLogType[]>(
    `${API_URL}/guilds/${guildId}/bans?fromDate=${fromDate}`,
    CONFIG
  );

export const getGuildModLogs = (guildId: string, fromDate: string) =>
  axios.get<GuildModLogType[]>(
    `${API_URL}/guilds/${guildId}/logs?fromDate=${fromDate}`,
    CONFIG
  );

export const getGuildBans = (guildId: string) =>
  axios.get<GuildBanType[]>(
    `${API_URL}/discord/guilds/${guildId}/bans`,
    CONFIG
  );

export const deleteGuildBan = (guildId: string, userId: string) =>
  axios.delete(`${API_URL}/discord/guilds/${guildId}/bans/${userId}`, CONFIG);
