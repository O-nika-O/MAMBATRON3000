import { getIconUrl } from "../utils/helpers";
import { GuildMenuItemStyle } from "../utils/styles";
import { PartialGuild } from "../utils/types";

type Props = {
  guild: PartialGuild;
};

export const GuildMenuItem = ({ guild }: Props) => (
  <GuildMenuItemStyle>
    <img
      src={getIconUrl(guild)}
      alt={guild.name}
      width={40}
      height={40}
      style={{ borderRadius: "50%" }}
    />
    <p>{guild.name}</p>
  </GuildMenuItemStyle>
);
