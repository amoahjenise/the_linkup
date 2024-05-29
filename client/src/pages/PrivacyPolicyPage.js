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

const PrivacyPolicyPage = () => {
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
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Last Updated: {today}
        </Typography>
      </Box>

      <section className={classes.section}>
        <Typography variant="h5" className={classes.subtitle}>
          Personal Information Collection
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We collect personal information as per the requirements of Quebec,
          Canada regulations and standards. This information may include but is
          not limited to:
          <ul>
            <li>Names</li>
            <li>Contact details</li>
            <li>Financial information</li>
            <li>Other relevant information</li>
          </ul>
        </Typography>
        {/* Add more sections as needed */}
      </section>

      {/* Other sections remain the same */}
    </Container>
  );
};

export default PrivacyPolicyPage;
