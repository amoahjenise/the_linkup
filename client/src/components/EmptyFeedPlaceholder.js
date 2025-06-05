import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import sadFaceImage from "../assets/sad-face-2692.png";
import { useColorMode } from "@chakra-ui/react";

const PlaceholderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: theme.spacing(10),
  textAlign: "center",
}));

const Illustration = styled("img")(({ theme, colorMode }) => ({
  width: "75px",
  height: "75px",
  marginBottom: theme.spacing(2),
  filter: colorMode === "dark" ? "invert(1)" : "invert(0)",
}));

const Message = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const EmptyFeedPlaceholder = ({
  message = "No linkups are available at the moment.",
}) => {
  const { colorMode } = useColorMode();

  return (
    <PlaceholderContainer>
      <Illustration
        src={sadFaceImage}
        alt="Empty Feed Illustration"
        colorMode={colorMode}
      />
      <Message variant="h5">{message}</Message>
      <Typography variant="body1">
        Create a new linkup to connect with others, or go to Settings &gt; User
        Settings to adjust your preferences and see more results.
      </Typography>
    </PlaceholderContainer>
  );
};

EmptyFeedPlaceholder.propTypes = {
  message: PropTypes.string,
};

export default EmptyFeedPlaceholder;
