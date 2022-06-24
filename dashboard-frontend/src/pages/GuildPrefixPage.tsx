import { useContext, useRef, useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import { useTransition, animated } from "react-spring";
import { updateGuildPrefix } from "../utils/api";
import { GuildContext, handleFocus } from "../utils/contexts/GuildContext";
import { useGuildConfig } from "../utils/hooks/useFetchGuildConfig";
import {
  Button,
  Container,
  Flex,
  InputField,
  Page,
  Title,
} from "../utils/styles";

export const GuildPrefixPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const { config, loading, error, prefix, setPrefix } = useGuildConfig(guildId);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // const input = useRef<HTMLInputElement>(null)
  // const idle = useRef<HTMLButtonElement>(null)
  const transition = useTransition(loadingUpdate, {
    from: { x: 0, y: 50, opacity: 0},
    enter: { x: 0, y: 0, opacity: 1},
    leave: { x: 0, y: 100, opacity: 0},
  })

  useEffect(() => {
    setTimeout(() => setLoadingUpdate(false), 2000)
  },[loadingUpdate])

  console.log("error from guildprefixpage", error);


  const savePrefix = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(prefix);
    // handleFocus(input);
    try {
      const res = await updateGuildPrefix(guildId, prefix);
      console.log(res);
      setLoadingUpdate(true);
      // handleFocus(idle);
    } catch (err) {
      console.log(err);
      // handleFocus(idle);
    }
  };

  const resetPrefix = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setPrefix("!");
    // handleFocus(input);
    try {
      const res = await updateGuildPrefix(guildId, "!");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page>
      <Container style={{ width: "800px" }}>
        {!loading && config ? (
          <>
            <Title>Update Command Prefix</Title>
            <form>
              <div>
                <label htmlFor="prefix">Current Prefix</label>
              </div>
              <InputField
                autoFocus
                // ref={input}
                style={{ margin: "10px 0px" }}
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
              <Flex
                // alignItems="normal"
                justifyContent="flex-end"
                // style={{ width: "100%" }}
              >
                <Button
                  variant="secondary"
                  type="button"
                  style={{ marginRight: "8px" }}
                  onClick={resetPrefix}
                >
                  Reset
                </Button>
                <Button variant="primary" onClick={savePrefix}>
                  Save
                </Button>
              </Flex>
            </form>
          </>
        ) : (
          <Flex>
            <MoonLoader size={30} color="white" />
          </Flex>
        )}
        {transition((style, item) => 
        item ? <animated.h3 style={style}>Prefix updated succesfully</animated.h3> : ''
        )}
      </Container>
    </Page>
  );
};
