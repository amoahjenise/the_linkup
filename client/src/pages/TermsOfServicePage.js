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

const TermsOfServicePage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <RootContainer>
      <Box mb={4}>
        <Title variant="h4">Terms of Service</Title>
        <Text variant="subtitle1">Last Updated: {today}</Text>
      </Box>

      <Section>
        <Subtitle variant="h6">1. Acceptance of Terms</Subtitle>
        <Text variant="body1">
          By accessing or using the Service, you agree to comply with and be
          bound by these Terms, our Privacy Policy, and any additional terms and
          conditions that we may provide to you in connection with specific
          services or products.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">2. Eligibility</Subtitle>
        <Text variant="body1">
          You must be at least 18 years old to use our Service. By using the
          Service, you represent and warrant that you meet the age requirement
          and have the legal capacity to enter into a binding contract.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">3. User Accounts</Subtitle>
        <Text variant="body1">
          To access certain features of the Service, you may be required to
          create an account. You agree to:
        </Text>
        <ul>
          <li>
            Provide accurate, current, and complete information during the
            registration process.
          </li>
          <li>
            Maintain the security and confidentiality of your account password.
          </li>
          <li>
            Notify us immediately of any unauthorized use of your account.
          </li>
        </ul>
        <Text variant="body1">
          You are responsible for all activities that occur under your account.
          We reserve the right to suspend or terminate your account if you
          violate these Terms.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">4. Use of the Service</Subtitle>
        <Text variant="body1">
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You agree not to:
        </Text>
        <ul>
          <li>
            Use the Service in any manner that could disable, overburden, or
            impair the Service.
          </li>
          <li>
            Use any robot, spider, or other automatic device, process, or means
            to access the Service.
          </li>
          <li>
            Use the Service for any commercial purpose without our express
            written consent.
          </li>
          <li>
            Upload, post, or transmit any content that infringes the rights of
            others or violates any applicable law.
          </li>
        </ul>
      </Section>

      <Section>
        <Subtitle variant="h6">5. Content</Subtitle>
        <Text variant="body1">
          You retain ownership of any content you submit, post, or display on or
          through the Service. By submitting content, you grant us a worldwide,
          non-exclusive, royalty-free, fully paid-up, and sublicensable license
          to use, copy, modify, create derivative works based on, distribute,
          and display your content in connection with the Service.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">6. Intellectual Property</Subtitle>
        <Text variant="body1">
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of The Linkup and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both Canada and foreign countries.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">7. Privacy</Subtitle>
        <Text variant="body1">
          Your privacy is important to us. Our Privacy Policy explains how we
          collect, use, and protect your information. By using the Service, you
          consent to our collection and use of your information as outlined in
          the Privacy Policy.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">8. Termination</Subtitle>
        <Text variant="body1">
          We may terminate or suspend your account and access to the Service,
          without prior notice or liability, for any reason, including if you
          breach these Terms. Upon termination, your right to use the Service
          will immediately cease.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">9. Disclaimers</Subtitle>
        <Text variant="body1">
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We
          make no warranties, express or implied, regarding the Service,
          including but not limited to the implied warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">10. Limitation of Liability</Subtitle>
        <Text variant="body1">
          To the fullest extent permitted by law, The Linkup shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred directly
          or indirectly, or any loss of data, use, goodwill, or other intangible
          losses, resulting from (a) your use or inability to use the Service;
          (b) any unauthorized access to or use of our servers and/or any
          personal information stored therein; (c) any interruption or cessation
          of transmission to or from the Service; (d) any bugs, viruses, trojan
          horses, or the like that may be transmitted to or through the Service
          by any third party; (e) any errors or omissions in any content or for
          any loss or damage incurred as a result of your use of any content
          posted, emailed, transmitted, or otherwise made available through the
          Service; and/or (f) the defamatory, offensive, or illegal conduct of
          any third party.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">11. Governing Law</Subtitle>
        <Text variant="body1">
          These Terms shall be governed by and construed in accordance with the
          laws of Quebec, Canada, without regard to its conflict of law
          provisions.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">12. Changes to Terms</Subtitle>
        <Text variant="body1">
          We reserve the right to modify these Terms at any time. We will
          provide notice of such changes by posting the updated Terms on our
          website or through the Service. Your continued use of the Service
          after any such changes constitutes your acceptance of the new Terms.
        </Text>
      </Section>

      <Section>
        <Subtitle variant="h6">13. Contact Us</Subtitle>
        <Text variant="body1">
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfServicePage;
