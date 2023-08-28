import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import PeopleIcon from "@material-ui/icons/People";
import ExploreIcon from "@material-ui/icons/Explore";
import Navbar from "../components/Navbar";
import IphoneImage from "../assets/iphone-13.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  leftContainer: {
    backgroundPosition: "0px 0px",
  },
  rightContainer: {
    backgroundPosition: "0px 0px",
    // padding: theme.spacing(2),
    border: "1px solid #e0e0e0",
  },
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
    fontSize: "2rem",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
      marginBottom: theme.spacing(2),
    },
  },
  termsAndServices: {
    justifyContent: "center",
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8),
    marginBottom: theme.spacing(2),
    fontSize: "10px",
  },
  centerText: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  icons: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  ctaButton: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
    backgroundColor: "#91e9ff",
  },
  button: {
    width: "100%",
    marginBottom: theme.spacing(2),
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
    textAlign: "center",
    borderTop: "1px solid #f5f8fa",
  },
}));

function LandingPage({ isMobile }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={classes.root}>
      <Navbar buttonText="Login" onLoginClick={handleLoginClick} />
      <Grid container spacing={0}>
        {isMobile ? (
          <Grid item xs={12} md={6} className={classes.rightColumn}>
            <div className={classes.rightContainer}>
              <div className={classes.icons}>
                <h1 className={classes.heroTitle}>Welcome to LUUL</h1>
                <ImageIcon className={classes.featureIcon} />
                <Typography
                  variant="h1"
                  component="h1"
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
                <PeopleIcon className={classes.featureIcon} />
                <Typography
                  variant="h1"
                  component="h1"
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
                <ExploreIcon className={classes.featureIcon} />
                <Typography
                  variant="h1"
                  component="h1"
                  className={classes.featureHeading}
                >
                  Experience
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.featureDescription}
                >
                  Share your adventures with the world and inspire others to
                  join in the fun.
                </Typography>
                <div className={classes.createAccountButton}>
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
                <Typography
                  variant="subtitle2"
                  component="small"
                  className={classes.termsAndServices}
                >
                  By signing up, you agree to the{" "}
                  <a href="/terms-of-service">Terms of Service </a> and{" "}
                  <a href="/privacy-policy">Privacy Policy</a>, including{" "}
                  <a href="/cookie-use">Cookie Use</a>.
                </Typography>
              </div>
            </div>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={6} className={classes.leftColumn}>
              <div className={classes.leftContainer}>
                <img
                  src={IphoneImage}
                  alt="Iphone"
                  style={{
                    maxWidth: "100%",
                    height: isMobile ? "auto" : "620px",
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.rightColumn}>
              <div className={classes.rightContainer}>
                <div className={classes.icons}>
                  <h1 className={classes.heroTitle}>Welcome to LUUL</h1>
                  <ImageIcon className={classes.featureIcon} />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={classes.featureHeading}
                  >
                    Discover
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    className={classes.featureDescription}
                  >
                    Explore a wide range of activities and events curated for
                    you.
                  </Typography>
                  <PeopleIcon className={classes.featureIcon} />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={classes.featureHeading}
                  >
                    Connect
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    className={classes.featureDescription}
                  >
                    Connect with like-minded individuals who share your
                    interests.
                  </Typography>
                  <ExploreIcon className={classes.featureIcon} />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={classes.featureHeading}
                  >
                    Experience
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    className={classes.featureDescription}
                  >
                    Share your adventures with the world and inspire others to
                    join in the fun.
                  </Typography>
                  <div className={classes.createAccountButton}>
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
                  <Typography
                    variant="subtitle2"
                    component="small"
                    className={classes.termsAndServices}
                  >
                    By signing up, you agree to the{" "}
                    <a href="/terms-of-service">Terms of Service </a> and{" "}
                    <a href="/privacy-policy">Privacy Policy</a>, including{" "}
                    <a href="/cookie-use">Cookie Use</a>.
                  </Typography>
                </div>
              </div>
            </Grid>
          </>
        )}
      </Grid>
      <footer className={classes.footer}>
        <p>&copy; {new Date().getFullYear()} LUUL. All rights reserved.</p>
      </footer>
    </div>

    // <div className={classes.root}>
    //   <Navbar buttonText="Login" onLoginClick={handleLoginClick} />
    //   <Grid container spacing={0}>
    //     <Grid item xs={12} md={6} className={classes.leftColumn}>
    //       <div className={classes.leftContainer}>
    //         <img
    //           src={IphoneImage}
    //           alt="Iphone"
    //           style={{
    //             maxWidth: "100%",
    //             height: isMobile ? "auto" : "620px",
    //           }}
    //         />
    //       </div>
    //     </Grid>
    //     <Grid item xs={12} md={6} className={classes.rightColumn}>
    //       <div className={classes.rightContainer}>
    //         <div className={classes.icons}>
    //           <h1 className={classes.heroTitle}>Welcome to LUUL</h1>
    //           <ImageIcon className={classes.featureIcon} />
    //           <Typography
    //             variant="h1"
    //             component="h1"
    //             className={classes.featureHeading}
    //           >
    //             Discover
    //           </Typography>
    //           <Typography
    //             variant="body2"
    //             component="p"
    //             className={classes.featureDescription}
    //           >
    //             Explore a wide range of activities and events curated for you.
    //           </Typography>
    //           <PeopleIcon className={classes.featureIcon} />
    //           <Typography
    //             variant="h1"
    //             component="h1"
    //             className={classes.featureHeading}
    //           >
    //             Connect
    //           </Typography>
    //           <Typography
    //             variant="body2"
    //             component="p"
    //             className={classes.featureDescription}
    //           >
    //             Connect with like-minded individuals who share your interests.
    //           </Typography>
    //           <ExploreIcon className={classes.featureIcon} />
    //           <Typography
    //             variant="h1"
    //             component="h1"
    //             className={classes.featureHeading}
    //           >
    //             Experience
    //           </Typography>
    //           <Typography
    //             variant="body2"
    //             component="p"
    //             className={classes.featureDescription}
    //           >
    //             Share your adventures with the world and inspire others to join
    //             in the fun.
    //           </Typography>
    //           <div className={classes.createAccountButton}>
    //             <Button
    //               variant="contained"
    //               color="primary"
    //               component={Link}
    //               to="/signup"
    //               className={classes.ctaButton}
    //             >
    //               Create Account
    //             </Button>
    //           </div>
    //           <Typography
    //             variant="subtitle2"
    //             component="small"
    //             className={classes.termsAndServices}
    //           >
    //             By signing up, you agree to the{" "}
    //             <a href="/terms-of-service">Terms of Service </a> and{" "}
    //             <a href="/privacy-policy">Privacy Policy</a>, including{" "}
    //             <a href="/cookie-use">Cookie Use</a>.
    //           </Typography>
    //         </div>
    //       </div>
    //     </Grid>
    //   </Grid>
    //   <footer className={classes.footer}>
    //     <p>&copy; {new Date().getFullYear()} LUUL. All rights reserved.</p>
    //   </footer>
    // </div>
  );
}

export default LandingPage;
