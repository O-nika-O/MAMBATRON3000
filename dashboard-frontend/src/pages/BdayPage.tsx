import { useContext, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { useTransition, animated } from "react-spring";
import { updateBdayChannelId } from "../utils/api";
import { GuildContext } from "../utils/contexts/GuildContext";
import { useBdayPage } from "../utils/hooks/useBdayPage";

import {
  Button,
  Container,
  Flex,
  Page,
  Select,
  TextArea,
  Title,
} from "../utils/styles";

export const BdayPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    selectedChannel,
    setSelectedChannel,
    loading,
    message,
    setMessage,
  } = useBdayPage(guildId);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoadingUpdate(false), 2000);
  }, [loadingUpdate]);

  const transition = useTransition(loadingUpdate, {
    from: { x: 0, y: 50, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: 0, y: 100, opacity: 0 },
  });

  const saveBdayChannel = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(message);
    try {
      const res = await updateBdayChannelId(
        guildId,
        selectedChannel || "",
        message || ""
      );
      setLoadingUpdate(true);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const resetWelcome = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setMessage("Happy Birthday!");
    try {
      const res = await updateBdayChannelId(
        guildId,
        selectedChannel || "",
        "Happy Birthday!"
      );
      setLoadingUpdate(true);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page>
      <Container>
        <Title>Update Welcome Message</Title>
        {channels && config && !loading ? (
          <div>
            <section>
              <div>
                <label>Current Channel</label>
              </div>
              <Select
                style={{ margin: "10px 0" }}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option>Please select a channel</option>
                {channels.map((channel) => (
                  <option
                    key={channel.id}
                    selected={channel.id === config.welcomeChannelId}
                    value={channel.id}
                  >
                    #{channel.name}
                  </option>
                ))}
              </Select>
            </section>
            <section style={{ margin: "10px 0px" }}>
              <div>
                <label htmlFor="message">Current Message</label>
              </div>
              <TextArea
                autoFocus
                onFocus={function (e) {
                  var val = e.target.value;
                  e.target.value = '';
                  e.target.value = val;
                }}
                style={{ marginTop: "10px" }}
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </section>
            <Flex
              alignItems="normal"
              // justifyContent="flex-end"
              // style={{ width: "100%" }}
            >
              <Button
                variant="secondary"
                type="button"
                style={{ marginRight: "8px" }}
                onClick={resetWelcome}
              >
                Reset
              </Button>
              <Button variant="primary" onClick={saveBdayChannel}>
                Save
              </Button>
            </Flex>
          </div>
        ) : (
          <Flex>
            <MoonLoader size={40} color="white" />
          </Flex>
        )}
        {transition((style, item) =>
          item ? (
            <animated.h3 style={style}>
              Welcome channel settings updated succesfully
            </animated.h3>
          ) : (
            ""
          )
        )}
      </Container>
    </Page>
  );
};
