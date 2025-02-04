import React from "react";
import { styled } from "@mui/material/styles";

// Define styled components
const Root = styled("div")(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
  width: "100%",
}));

const Message = styled("h2")(({ theme }) => ({
  fontSize: "1.5rem",
  margin: theme.spacing(2, 0),
}));

const LastStep = ({ clerkUser }) => {
  const name = clerkUser.firstName;
  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const welcomeMessage = `Let's get started, ${formattedName}!`;

  return (
    <Root>
      <Message>{welcomeMessage}</Message>
    </Root>
  );
};

export default LastStep;
