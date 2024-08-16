import React from "react";
import { styled } from "@mui/material/styles";
import { Button, Typography, Box } from "@mui/material";

// Define styled components
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    padding: theme.spacing(10),
    gap: theme.spacing(7),
  },
}));

const TextContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    marginBottom: 0,
    paddingRight: theme.spacing(6),
  },
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const Subtext = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0097A7",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "#007b86",
  },
}));

const Image = styled("img")({
  maxWidth: "100%",
  height: "auto",
});

const ImageContainer = styled(Box)({
  textAlign: "center",
});

const EmptyNotificationsPlaceholder = () => {
  const goToHomePage = () => {
    window.location.href = "/home";
  };

  return (
    <Container>
      <TextContainer>
        <Heading variant="h4">You have no notifications</Heading>
        <Subtext variant="body1">
          Visit the feed to link up with others and stay connected.
        </Subtext>
        <StyledButton variant="contained" onClick={goToHomePage}>
          Go to Feed
        </StyledButton>
      </TextContainer>
    </Container>
  );
};

export default EmptyNotificationsPlaceholder;
