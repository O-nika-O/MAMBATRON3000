import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { GuildMenuItem } from "../components/GuildMenuItem";
import { GuildContext } from "../utils/contexts/GuildContext";
import { useFetchGuilds } from "../utils/hooks/useFetchGuilds";
import { Container, Flex, Page } from "../utils/styles";
import { PartialGuild } from "../utils/types";

export const MenuPage = () => {
  const navigate = useNavigate();
  const { updateGuild } = useContext(GuildContext);
  const { guilds, loading, error } = useFetchGuilds();
  console.log("error in MenuPage", error);

  const handleClick = (guild: PartialGuild) => {
    updateGuild(guild);
    navigate("/dashboard/categories");
  };

  return (
    <Page>
      <Container>
        <h2 style={{ fontWeight: 300 }}>Select a Server</h2>
        <div>
          {loading ? (
            <Flex>
              <MoonLoader size={40} color="white" />
            </Flex>
          ) : (
            <div>
              {guilds &&
                guilds.map((guild) => (
                  <div key={guild.id} onClick={() => handleClick(guild) }>
                    <GuildMenuItem guild={guild} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
};
