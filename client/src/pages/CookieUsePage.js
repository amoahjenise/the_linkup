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

const CookieUsePage = () => {
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
          Cookie Use
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Last Updated: {today}
        </Typography>
      </Box>

      <section className={classes.section}>
        <Typography variant="h5" className={classes.subtitle}>
          Cookies Usage
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We use cookies on our website in compliance with Quebec, Canada
          regulations and standards. These cookies are used for various purposes
          including but not limited to:
          <ul>
            <li>Tracking user interactions</li>
            <li>Improving user experience</li>
            <li>Marketing and analytics</li>
          </ul>
        </Typography>
        {/* Add more sections as needed */}
      </section>

      {/* Other sections remain the same */}
    </Container>
  );
};

export default CookieUsePage;
