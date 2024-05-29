import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom"; // Import useHistory from React Router
import LoadingSpinner from "../components/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  section: {
    height: "100%",
  },
  relative: {
    position: "relative",
    height: "100%",
    overflow: "hidden",
    paddingTop: theme.spacing(14),
  },
  absolute: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -10,
  },
  bgBlack: {
    position: "fixed",
    inset: 0,
    zIndex: -10,
    mixBlendMode: "multiply",
  },
  contentContainer: {
    margin: "0 auto",
    maxWidth: "2xl",
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.up("sm")]: {
      padding: `${theme.spacing(6)}px ${theme.spacing(6)}px`,
    },
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing(14)}px ${theme.spacing(8)}px`,
    },
  },
  textCenter: {
    textAlign: "center",
    marginBottom: theme.spacing(8),
  },
  title: {
    fontSize: "4rem",
    fontWeight: "bold",
    letterSpacing: "tight",
    // color: theme.palette.common.white,
    [theme.breakpoints.up("sm")]: {
      fontSize: "6rem",
    },
  },
  subtitle: {
    marginTop: theme.spacing(6),
    fontSize: "1.25rem",
    lineHeight: "2",
    // color: theme.palette.text.secondary,
  },
  buttonContainer: {
    marginTop: theme.spacing(10),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(6),
  },
  button: {
    textTransform: "none",
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
  body2: {
    fontSize: "0.875rem",
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className={classes.section}>
      {isAuthenticated ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.relative}>
          <div className={classes.absolute} />
          <div className={classes.bgBlack} aria-hidden="true" />
          <div className={classes.contentContainer}>
            <div className={classes.textCenter}>
              <h1 className={classes.title}>Welcome To Link-Up!</h1>
              <p className={classes.subtitle}>
                Join our community to explore a wide range of activities and
                events with like-minded individuals.
              </p>
              <Typography
                variant="subtitle2"
                component="small"
                className={classes.termsAndServices}
              >
                By signing up, you agree to the{" "}
                <a href="/terms-of-service">Terms of Service</a> and{" "}
                <a href="/privacy-policy">Privacy Policy</a>, including{" "}
                <a href="/cookie-use">Cookie Use</a>.
              </Typography>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/sign-up")}
                  className={classes.button}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/sign-in")}
                  className={classes.button}
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.textCenter}>
            <Typography variant="body2">
              &copy; {new Date().getFullYear()} Link-Up. All rights reserved.
            </Typography>
          </div>
        </div>
      )}
    </section>
  );
};

export default LandingPage;
