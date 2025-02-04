import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";

// Define styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const Section = styled("div")(({ theme }) => ({
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

const UserDataDeletionPage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <RootContainer>
      <Box mb={4}>
        <Title variant="h4">User Data Deletion Instructions</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h6">How to Request Data Deletion</Subtitle>
        <Text variant="body1">
          If you would like to delete your data from our service, please follow
          these steps:
        </Text>
        <ul>
          <li>
            Contact our support team at{" "}
            <a
              href="mailto:info@thelinkup.ca"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              info@thelinkup.ca
            </a>
          </li>
          <li>
            Include your account information and a request for data deletion.
          </li>
          <li>
            Our team will process your request and confirm the deletion of your
            data.
          </li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">Additional Information</Subtitle>
        <Text variant="body1">
          Please note that deleting your data may result in the loss of access
          to certain services and features. Once your data is deleted, it cannot
          be recovered.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">Contact Us</Subtitle>
        <Text variant="body1">
          If you have any questions or concerns about data deletion, please
          contact us at:
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

export default UserDataDeletionPage;
