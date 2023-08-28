import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ImageIcon from "@material-ui/icons/Image";
import PeopleIcon from "@material-ui/icons/People";
import ExploreIcon from "@material-ui/icons/Explore";

const useStyles = makeStyles((theme) => ({
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    backgroundColor: "#fff",
  },
  heroTitle: {
    fontSize: "2.5rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
      marginBottom: theme.spacing(2),
    },
  },
  centerText: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  ctaButton: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },
  content: {
    flex: "1 0 auto",
    paddingTop: theme.spacing(2),
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  moreSection: {
    marginTop: theme.spacing(2),
  },
  feature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(4),
    },
  },
  featureIcon: {
    fontSize: "3rem",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  featureHeading: {
    fontSize: "1.5rem",
    marginBottom: theme.spacing(1),
  },
  featureDescription: {
    fontSize: "1rem",
    textAlign: "center",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  footer: {
    flexShrink: 0,
    color: "black",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    textAlign: "center",
    marginTop: theme.spacing(4),
    borderTop: "1px solid lightgrey",
  },
}));

function LandingPage() {
  const navigate = useNavigate();

  const classes = useStyles();
  // const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={classes.container}>
      <Navbar buttonText="Login" onLoginClick={handleLoginClick} />
      <div className={classes.content}>
        <div className={classes.hero}>
          <h1 className={classes.heroTitle}>Welcome to LUUL</h1>
          <p className={classes.heroSubtitle}>
            Find like-minded individuals today
          </p>
          <div className="cta-buttons">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
              className={classes.ctaButton}
            >
              Create Account
            </Button>
          </div>
        </div>
        <main className={classes.main}>
          <Typography
            variant="body1"
            component="p"
            className={classes.centerText}
          >
            Start your journey today and connect with other users to discover
            new activities and experiences. Share your adventures with the world
            and inspire others to join in the fun. With our app, the
            possibilities are endless. Join now and start linking up with
            like-minded individuals!
          </Typography>
          <Grid container spacing={4} className={classes.moreSection}>
            <Grid item xs={12} sm={4} className={classes.feature}>
              <ImageIcon className={classes.featureIcon} />
              <Typography
                variant="h2"
                component="h2"
                className={classes.featureHeading}
              >
                Discover
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={classes.featureDescription}
              >
                Explore a wide range of activities and events curated for you.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.feature}>
              <PeopleIcon className={classes.featureIcon} />
              <Typography
                variant="h2"
                component="h2"
                className={classes.featureHeading}
              >
                Connect
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={classes.featureDescription}
              >
                Connect with like-minded individuals who share your interests.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.feature}>
              <ExploreIcon className={classes.featureIcon} />
              <Typography
                variant="h2"
                component="h2"
                className={classes.featureHeading}
              >
                Experience
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={classes.featureDescription}
              >
                Create unforgettable memories and experiences with new friends.
              </Typography>
            </Grid>
          </Grid>
        </main>
      </div>
      <footer className={classes.footer}>
        <p>&copy; {new Date().getFullYear()} LUUL. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
