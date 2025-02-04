import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";

// Define styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const Section = styled("section")(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const Text = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const CookieUsePage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <RootContainer>
      <Box mb={4}>
        <Title variant="h4">Cookie Use</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h5">Cookies Usage</Subtitle>
        <Text variant="body1">
          We use cookies on our website in compliance with Quebec, Canada
          regulations and standards. These cookies are used for various purposes
          including but not limited to:
          <ul>
            <li>Tracking user interactions</li>
            <li>Improving user experience</li>
            <li>Marketing and analytics</li>
          </ul>
        </Text>
        {/* Add more sections as needed */}
      </Section>

      {/* Other sections remain the same */}
    </RootContainer>
  );
};

export default CookieUsePage;
