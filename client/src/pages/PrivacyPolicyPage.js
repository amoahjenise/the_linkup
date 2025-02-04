import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";

// Define styled components
const StyledContainer = styled(Container)(({ theme }) => ({
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

const PrivacyPolicyPage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <StyledContainer>
      <Box mb={4}>
        <Title variant="h4">Privacy Policy</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h5">Personal Information Collection</Subtitle>
        <Text variant="body1">
          We collect personal information as per the requirements of Quebec,
          Canada regulations and standards. This information may include but is
          not limited to:
          <ul>
            <li>Names</li>
            <li>Contact details</li>
            <li>Financial information</li>
            <li>Other relevant information</li>
          </ul>
        </Text>
        {/* Add more sections as needed */}
      </Section>

      {/* Other sections remain the same */}
    </StyledContainer>
  );
};

export default PrivacyPolicyPage;
