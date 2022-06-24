import { useEffect, useState } from "react";
import { getGuildChannels, getGuildConfig } from "../api";
import { GuildConfigType, PartialGuildChannel } from "../types";

export function useBdayPage(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [selectedChannel, setSelectedChannel] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedChannel(data.bdayChannelId);
        setMessage(data.bdayMessage);
        return getGuildChannels(guildId);
      })
      .then(({ data }) => setChannels(data))
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => setLoading(false), 1000));
  }, []);

  return {
    config,
    channels,
    loading,
    selectedChannel,
    setSelectedChannel,
    message,
    setMessage
  };
}
