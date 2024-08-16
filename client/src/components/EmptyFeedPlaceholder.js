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

const Link = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
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

      <Message variant="h5">
        There are no linkups available at the moment.
      </Message>
      <Typography variant="body1">
        Start by creating a link-up to connect with others.
      </Typography>
    </PlaceholderContainer>
  );
};

export default EmptyFeedPlaceholder;
