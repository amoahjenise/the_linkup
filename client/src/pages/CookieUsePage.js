import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";

// Define styled components
const RootContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  padding: theme.spacing(3),
  minHeight: "100vh",
}));

const Section = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 700,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  fontWeight: 600,
}));

const Text = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: "#aaa",
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
        <Title variant="h4">Cookie Use Policy</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h6">1. Introduction</Subtitle>
        <Text variant="body1">
          This Cookie Use Policy explains how we use cookies on our website and
          service. By using our website, you consent to the use of cookies as
          described in this policy.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">2. What Are Cookies?</Subtitle>
        <Text variant="body1">
          Cookies are small text files that are stored on your device when you
          visit a website. They are used to enhance your browsing experience by
          remembering your preferences and settings.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">3. Types of Cookies We Use</Subtitle>
        <Text variant="body1">We use the following types of cookies:</Text>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for
            the website to function and cannot be turned off.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These cookies help us analyze
            how visitors use our website.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These cookies allow the website
            to remember your preferences and choices.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These cookies are used to
            display advertisements that are relevant to you.
          </li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">4. Managing Cookies</Subtitle>
        <Text variant="body1">
          You can manage your cookie preferences through your browser settings.
          You can choose to disable or delete cookies, but doing so may affect
          your experience on our website.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">5. Changes to This Policy</Subtitle>
        <Text variant="body1">
          We may update this Cookie Use Policy from time to time. We will notify
          you of any changes by posting the updated policy on our website. Your
          continued use of the website constitutes your acceptance of these
          changes.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">6. Contact Us</Subtitle>
        <Text variant="body1">
          If you have any questions about this Cookie Use Policy, please contact
          us at:
        </Text>
        <Typography variant="body1">
          <a
            href="mailto:info@thelinkup.ca"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            info@thelinkup.ca
          </a>
        </Typography>
      </Section>
    </RootContainer>
  );
};

export default CookieUsePage;
