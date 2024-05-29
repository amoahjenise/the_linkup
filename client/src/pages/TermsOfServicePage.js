import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

const TermsOfServicePage = () => {
  const classes = useStyles();

  // Get today's date in the format "Month Day, Year"
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className={classes.root}>
      <Box mb={4}>
        <Typography variant="h4" className={classes.title}>
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Last Updated: {today}
        </Typography>
      </Box>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" className={classes.text}>
          By accessing or using the Service, you agree to comply with and be
          bound by these Terms, our Privacy Policy, and any additional terms and
          conditions that we may provide to you in connection with specific
          services or products.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          2. Eligibility
        </Typography>
        <Typography variant="body1" className={classes.text}>
          You must be at least 13 years old to use our Service. By using the
          Service, you represent and warrant that you meet the age requirement
          and have the legal capacity to enter into a binding contract.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          3. User Accounts
        </Typography>
        <Typography variant="body1" className={classes.text}>
          To access certain features of the Service, you may be required to
          create an account. You agree to:
        </Typography>
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
        <Typography variant="body1" className={classes.text}>
          You are responsible for all activities that occur under your account.
          We reserve the right to suspend or terminate your account if you
          violate these Terms.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          4. Use of the Service
        </Typography>
        <Typography variant="body1" className={classes.text}>
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You agree not to:
        </Typography>
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
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          5. Content
        </Typography>
        <Typography variant="body1" className={classes.text}>
          You retain ownership of any content you submit, post, or display on or
          through the Service. By submitting content, you grant us a worldwide,
          non-exclusive, royalty-free, fully paid-up, and sublicensable license
          to use, copy, modify, create derivative works based on, distribute,
          and display your content in connection with the Service.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          6. Intellectual Property
        </Typography>
        <Typography variant="body1" className={classes.text}>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of Link-Up (LUUL) and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both the United States and foreign countries.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          7. Privacy
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Your privacy is important to us. Our Privacy Policy explains how we
          collect, use, and protect your information. By using the Service, you
          consent to our collection and use of your information as outlined in
          the Privacy Policy.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          8. Termination
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We may terminate or suspend your account and access to the Service,
          without prior notice or liability, for any reason, including if you
          breach these Terms. Upon termination, your right to use the Service
          will immediately cease.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          9. Disclaimers
        </Typography>
        <Typography variant="body1" className={classes.text}>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We
          make no warranties, express or implied, regarding the Service,
          including but not limited to the implied warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          10. Limitation of Liability
        </Typography>
        <Typography variant="body1" className={classes.text}>
          To the fullest extent permitted by law, Link-Up (LUUL) shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other
          intangible losses, resulting from (a) your use or inability to use the
          Service; (b) any unauthorized access to or use of our servers and/or
          any personal information stored therein; (c) any interruption or
          cessation of transmission to or from the Service; (d) any bugs,
          viruses, trojan horses, or the like that may be transmitted to or
          through the Service by any third party; (e) any errors or omissions in
          any content or for any loss or damage incurred as a result of your use
          of any content posted, emailed, transmitted, or otherwise made
          available through the Service; and/or (f) the defamatory, offensive,
          or illegal conduct of any third party.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          11. Governing Law
        </Typography>
        <Typography variant="body1" className={classes.text}>
          These Terms shall be governed by and construed in accordance with the
          laws of Quebec, Canada, without regard to its conflict of law
          provisions.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          12. Changes to Terms
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We reserve the right to modify these Terms at any time. We will
          provide notice of such changes by posting the updated Terms on our
          website or through the Service. Your continued use of the Service
          after any such changes constitutes your acceptance of the new Terms.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.subtitle}>
          13. Contact Us
        </Typography>
        <Typography variant="body1" className={classes.text}>
          If you have any questions about these Terms, please contact us at:
        </Typography>
        <Typography variant="body1" className={classes.text}>
          [Contact Information Will Soon Be Provided]
        </Typography>
      </div>
    </Container>
  );
};

export default TermsOfServicePage;
