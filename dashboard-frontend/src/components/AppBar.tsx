import { AppBarStyle } from "../utils/styles";
import { useContext } from "react";
import { GuildContext } from "../utils/contexts/GuildContext";
import { Navigate } from "react-router-dom";
import { getIconUrl } from "../utils/helpers";

export const AppBar = () => {
  const { guild } = useContext(GuildContext);
  return guild ? (
    <AppBarStyle>
      <h1 style={{ fontWeight: "normal", fontSize: "20px" }}>
        Configuring {guild.name}
      </h1>
      <img
        src={getIconUrl(guild)}
        height={55}
        width={55}
        style={{
          borderRadius: "50%",
        }}
        alt="logo"
      />
    </AppBarStyle>
  ) : (
    <Navigate replace to="/menu" />
  );
};
