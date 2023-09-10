import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import PeopleIcon from "@material-ui/icons/People";
import ExploreIcon from "@material-ui/icons/Explore";
import logo from "../logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  welcomeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(6),
    },
  },
  logo: {
    height: "50px",
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
    alignItems: "start",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  leftContainer: {
    backgroundPosition: "0px 0px",
  },
  rightContainer: {
    backgroundPosition: "0px 0px",
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
    backgroundColor: "#91e9ff",
    marginTop: theme.spacing(1),
  },
  createAccountButton: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  loginLink: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    marginRight: theme.spacing(2),
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  signUpLink: {
    color: "blue",
    textDecoration: "none",
    cursor: "pointer",
    marginLeft: theme.spacing(2),
    fontSize: "1.5rem",
    fontWeight: "bold",
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
    marginBottom: theme.spacing(2),
  },
  footer: {
    flexShrink: 0,
    color: "gray",
    // backgroundColor: "#fff",
    textAlign: "center",
    borderTop: "1px solid #f5f8fa",
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));

function LandingPage({ isMobile }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <Navbar buttonText="Login" onLoginClick={handleLoginClick} /> */}
      <Grid container spacing={0}>
        {isMobile ? (
          <Grid item xs={12} md={6} className={classes.rightColumn}>
            <div className={classes.rightContainer}>
              <div className={classes.icons}>
                <div className={classes.welcomeContainer}>
                  <img src={logo} alt="Logo" className={classes.logo} />
                  <h1 className={classes.heroTitle}>Welcome to LUUL </h1>
                </div>
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
                  Explore a wide range of activities and events.
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
                  <Link to="/login" className={classes.loginLink}>
                    Log in
                  </Link>
                  <p>/</p>
                  <Link to="/signup" className={classes.signUpLink}>
                    Sign Up
                  </Link>
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
                  src="https://www.transparentpng.com/thumb/-iphone-x/v8dHCT-apple-iphone.png"
                  alt="Iphone"
                  style={{
                    maxWidth: "100%",
                    height: isMobile ? "auto" : "520px",
                  }}
                ></img>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.rightColumn}>
              <div className={classes.rightContainer}>
                <div className={classes.icons}>
                  <div className={classes.welcomeContainer}>
                    <img src={logo} alt="Logo" className={classes.logo} />
                    <h1 className={classes.heroTitle}>Welcome to LUUL</h1>
                  </div>
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
                    Explore a wide range of activities and events.
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
                    <Link to="/login" className={classes.loginLink}>
                      Log in
                    </Link>
                    <p>/</p>
                    <Link to="/signup" className={classes.signUpLink}>
                      Sign Up
                    </Link>
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
