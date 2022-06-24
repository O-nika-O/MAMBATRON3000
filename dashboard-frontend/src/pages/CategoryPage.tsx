import { useContext } from "react";
import { GuildContext } from "../utils/contexts/GuildContext";
import {
  Container,
  Flex,
  Grid,
  Page,
  TextButton,
  Title,
} from "../utils/styles";
import {
  IoSettingsOutline,
  IoNewspaperOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const CategoryPage = () => {
  const { guild } = useContext(GuildContext);
  const navigate = useNavigate();

  console.log("guild context from categorypage",guild);

  return (
    <Page>
      <Container>
        <div>
          <Flex justifyContent="space-between">
            <Title>Guild Information</Title>
            <IoInformationCircleOutline size={40} />
          </Flex>
          <Grid>
            <TextButton onClick={() => navigate("/dashboard/analytics")}>
              Analytics
            </TextButton>
            <TextButton onClick={() => navigate("/dashboard/bans")}>
              Guild Bans
            </TextButton>
          </Grid>
        </div>
        <div style={{ borderTop: "1px solid #ffffff1b", marginTop: "30px" }}>
          <Flex justifyContent="space-between">
            <Title>Basic Configurations</Title>
            <IoSettingsOutline size={40} />
          </Flex>
          <Grid>
            <TextButton onClick={() => navigate("/dashboard/prefix")}>
              Commmand Prefix
            </TextButton>
            <TextButton onClick={() => navigate("/dashboard/message")}>
              Welcome Message
            </TextButton>
          </Grid>
        </div>
        <div style={{ borderTop: "1px solid #ffffff1b", marginTop: "30px" }}>
          <Flex justifyContent="space-between">
            <Title>Channel Logs</Title>
            <IoNewspaperOutline size={40} />
          </Flex>
          <Grid>
            <TextButton onClick={() => navigate("/dashboard/bday")}>Bday Command</TextButton>
            <TextButton onClick={() => navigate("/dashboard/santa")}>Secret Santa</TextButton>
          </Grid>
        </div>
      </Container>
    </Page>
  );
};
