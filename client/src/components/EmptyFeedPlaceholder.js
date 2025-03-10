import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import sadFaceImage from "../assets/sad-face-2692.png"; // Import the PNG image
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
  width: "200px",
  height: "200px",
  marginBottom: theme.spacing(2),
  filter: colorMode === "dark" ? "invert(1)" : "invert(0)", // Apply inversion based on color mode
}));

const Message = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const EmptyFeedPlaceholder = () => {
  const { colorMode } = useColorMode();

  return (
    <PlaceholderContainer>
      <Illustration
        src={sadFaceImage} // Use the imported PNG image
        alt="Empty Feed Illustration"
        colorMode={colorMode}
      />

      <Message variant="h5">No linkups are available at the moment.</Message>
      <Typography variant="body1">
        Create a new linkup to connect with others, or go to Settings &gt; User
        Settings to adjust your preferences and see more results.
      </Typography>
    </PlaceholderContainer>
  );
};

export default EmptyFeedPlaceholder;
