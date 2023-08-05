import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    backgroundColor: "#fff",
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: theme.spacing(2),
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
  ctaButton: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    flex: "1 0 auto",
    paddingTop: theme.spacing(8), // Increase or decrease the value as desired
    paddingBottom: theme.spacing(4), // Increase or decrease the value as desired
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    flex: "1 0 auto",
  },
  footer: {
    flexShrink: 0,
    color: "black",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    textAlign: "center",
    marginTop: theme.spacing(4), // Increase or decrease the value as desired
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
          <p>
            Start your journey today and connect with other users to discover
            new activities and experiences. Share your adventures with the world
            and inspire others to join in the fun. With our app, the
            possibilities are endless. Join now and start linking up with
            like-minded individuals!
          </p>
        </main>
      </div>
      <footer className={classes.footer}>
        <p>&copy; LUUL 2023</p>
      </footer>
    </div>
  );
}

export default LandingPage;
