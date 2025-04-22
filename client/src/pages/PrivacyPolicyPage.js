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

const PrivacyPolicyPage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <RootContainer>
      <Box mb={4}>
        <Title variant="h4">Privacy Policy</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h6">1. Personal Information Collection</Subtitle>
        <Text variant="body1">
          We collect personal information as per the requirements of Quebec,
          Canada regulations and standards. This information may include but is
          not limited to:
        </Text>
        <ul>
          <li>Names</li>
          <li>Contact details</li>
          <li>Financial information</li>
          <li>Other relevant information</li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">2. Use of Information</Subtitle>
        <Text variant="body1">
          The information we collect may be used for the following purposes:
        </Text>
        <ul>
          <li>Providing our services</li>
          <li>Improving our services</li>
          <li>Complying with legal requirements</li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">3. Information Sharing</Subtitle>
        <Text variant="body1">
          We do not share your personal information with third parties except:
        </Text>
        <ul>
          <li>When required by law</li>
          <li>With trusted service providers</li>
          <li>For business transfers</li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">4. Data Security</Subtitle>
        <Text variant="body1">
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure. However, no method of
          transmission over the Internet or electronic storage is 100% secure.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">5. Your Rights</Subtitle>
        <Text variant="body1">
          You have the right to access, correct, or delete your personal
          information. To exercise these rights, please contact us using the
          details provided below.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">6. Changes to Privacy Policy</Subtitle>
        <Text variant="body1">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated "Last Updated" date.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">7. Contact Us</Subtitle>
        <Text variant="body1">
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us at:
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

export default PrivacyPolicyPage;
