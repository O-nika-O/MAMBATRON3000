import { PartialGuild } from "./types";

export const getIconUrl = (guild: PartialGuild) => 
    `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;