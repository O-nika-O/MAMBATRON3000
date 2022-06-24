import styled, { css } from "styled-components";
import cursor from "../../assets/cursor_copy.png";

export const MainButton = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  justify-content: space-between;
  background-color: #2121217d;
  padding: 4px 50px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #58585863;
  margin: 10px 0px;
  box-shadow: 0px 1px 5px 0px #00000018;
  cursor: url(${cursor}), auto;
`;

export const TextButton = styled(MainButton)`
  padding: 18px 28px;
  width: 100%;
  background-color: #272727;
`;

export const HomePageStyle = styled.div`
  height: 100%;
  padding: 100px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const GuildMenuItemStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: #252525;
  border-radius: 5px;
  border: 1px solid #ffffff2f;
  margin: 8px 0px;
  cursor: url(${cursor}), auto;
`;

export const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
`;

export const AppBarStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 35px;
  box-sizing: border-box;
  border-bottom: 1px solid #c9c9c921;
  cursor: default;
`;

export const Title = styled.p`
  font-size: 22px;
  cursor: default;
`;

//watch out this costumization
type FlexProps = Partial<{
  alignItems: string;
  justifyContent: string;
  flexDirection: string;
}>;

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: ${({ alignItems }) => alignItems || "center"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
`;

export const InputField = styled.input`
  padding: 14px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: #ffffff;
  font-family: "DM Sans", sans-serif;
  background-color: #272727;
  border-radius: 5px;
  border: 1px solid #3f3f3f;
  outline: none;
  width: 100%;
  :focus {
    outline: 1px solid #ffffff5a;
  };
  autofocus: true;
`;

export const TextArea = styled.textarea`
  padding: 14px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: #ffffff;
  font-family: "DM Sans", sans-serif;
  background-color: #272727;
  border-radius: 5px;
  border: 1px solid #3f3f3f;
  outline: none;
  width: 100%;
  resize: none;
  :focus {
    outline: 1px solid #ffffff5a;
  }
`;

type ButtonProps = {
  variant: "primary" | "secondary";
};
export const Button = styled.button<ButtonProps>`
  padding: 10px 24px;
  font-size: 16px;
  outline: none;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-family: "DM Sans", sans-serif;
  ${({ variant }) =>
    variant === "primary" &&
    css`
      background-color: #006ed3;
    `}
  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background-color: #3d3d3d;
    `}
`;

export const Page = styled.div`
  padding: 50px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  background-color: inherit;
  color: #fff;
  border: 1px solid #3f3f3f;
  border-radius: 5px;
  & > option {
    background-color: #292929;
  }
  cursor: url(${cursor}), auto;
`;

export const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: #0000006c;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;
export const UserBanCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ffffff1f;
  box-sizing: border-box;
  padding: 18px;
  border-radius: 4px;
  cursor: url(${cursor}), auto;
`;

type ContextMenuContainerProps = {
  top: number;
  left: number;
};

export const ContextMenuContainer = styled.div<ContextMenuContainerProps>`
  position: absolute;
  background-color: #353535;
  border-radius: 3px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);
  height: auto;
  width: 200px;
  box-sizing: border-box;
  cursor: url(${cursor}), auto;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `}
  ul {
    list-style-type: none;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }
  ul li {
    padding: 10px 14px;
    border-radius: 3px;
  }
  ul li:hover {
    background-color: #444444;
  }
`;

export const FootNote = styled.p`
  font-size: 16px;
  position: absolute;
  bottom: 15px;
  left: 60px;
  cursor: default;
`
