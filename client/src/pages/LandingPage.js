import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoSrc from "../assets/logo.png";
import LandingPageImage from "../assets/LandingPageImage.png";
import Banner from "../assets/Banner3.jpg";
import AppDarkMode from "../assets/AppDarkMode.png";
import AppLightMode from "../assets/AppLightMode.png";

// Styled Components
const PageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: `url(${Banner}) no-repeat center center fixed`, // Use the background image
  backgroundSize: "cover",
  padding: "20px",
});

const Logo = styled("img")({
  width: "30px",
  height: "30px",
  marginRight: "10px",
  filter: "invert(1)", // This will turn the logo white
});

const ContentContainer = styled("main")(({ theme }) => ({
  display: "flex",
  flex: 1,
  padding: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "transparent",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    height: "calc(100vh - 80px)", // Adjust height minus the footer
  },
}));

const RightColumn = styled("div")(({ theme }) => ({
  flex: 1,
  display: "none", // Hide by default (for mobile)
  justifyContent: "center", // Align content to the right
  alignItems: "center",
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    display: "flex", // Show on larger screens
    marginTop: 0,
  },
  [theme.breakpoints.down("sm")]: {
    display: "none", // Ensure it's hidden in mobile view
  },
}));

const ResponsiveImage = styled("img")({
  maxHeight: "570px",
  maxWidth: "auto", // Optional: limit max width if needed
  borderRadius: "8px", // Optional: add some styling
});

const LeftColumn = styled("div")(({ theme }) => ({
  flex: 1,
  textAlign: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    // Add margin or padding if needed for mobile
    paddingTop: theme.spacing(4), // Additional spacing on top for better aesthetics
  },
}));

const LeftSubsectionContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(15), // Additional spacing on top for better aesthetics
  },
}));

const LeftSubsection = styled("div")(({ theme }) => ({
  backgroundColor: "rgb(0, 0, 0, 0.2)",
  padding: theme.spacing(0, 1), // Additional spacing on top for better aesthetics
  paddingBottom: theme.spacing(1), // Additional spacing on top for better aesthetics
}));

const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  borderTop: "1px solid #e0e0e0",
  color: "#FFFFFF", // Light color for readability
  backgroundColor: "transparent",
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#FFFFFF", // Bright white to contrast with the background
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Stronger shadow for better contrast
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#FFFFFF", // Light pastel for a subtle contrast
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.6rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  backgroundColor: "#FFFFFF", // White button for contrast
  color: "#00796B",
  "&:hover": {
    backgroundColor: "#FFEBEE",
  },
  borderRadius: "30px",
  marginRight: theme.spacing(2),
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  color: "#FFFFFF",
  borderColor: "#FFFFFF", // White border for subtle styling
  borderRadius: "30px",
  "&:hover": {
    borderColor: "#FFEBEE",
    color: "#FFEBEE",
  },
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const VideoContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageContainer>
      <ContentContainer>
        <LeftColumn>
          <Title>The Linkup</Title>
          <LeftSubsectionContainer>
            <LeftSubsection>
              <Subtitle>
                Connect with new people and organize meetups around your
                interests.
              </Subtitle>
              <Typography
                variant="subtitle2"
                component="small"
                sx={{ marginTop: 2, color: "#FFFFFF" }}
              >
                By signing up, you agree to the{" "}
                <a href="/terms-of-service" style={{ color: "#ffe6ff" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" style={{ color: "#ffe6ff" }}>
                  Privacy Policy
                </a>
                , including{" "}
                <a href="/cookie-use" style={{ color: "#ffe6ff" }}>
                  Cookie Use
                </a>
                .
              </Typography>
            </LeftSubsection>
          </LeftSubsectionContainer>
          <div style={{ marginTop: "20px" }}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </StyledButton>
            <OutlinedButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/sign-in")}
            >
              Log In
            </OutlinedButton>
          </div>
        </LeftColumn>
        <RightColumn>
          {/* <VideoContainer style={{ marginTop: 70 }}> */}
          <ResponsiveImage src={AppDarkMode} alt="screenshot" />
          {/* </VideoContainer> */}
        </RightColumn>
      </ContentContainer>

      <Footer>
        <Logo src={logoSrc} alt="The Linkup Logo" />
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
        </Typography>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { styled } from "@mui/material/styles";
// import { Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import logoSrc from "../assets/logo.png";
// import LandingPageImage from "../assets/LandingPageImage.png";
// import Banner from "../assets/Banner3.jpg";

// // Styled Components
// const PageContainer = styled("div")({
//   display: "flex",
//   flexDirection: "column",
//   minHeight: "100vh",
//   background: `url(${Banner}) no-repeat center center fixed`, // Use the background image
//   backgroundSize: "cover",
//   padding: "20px",
// });

// const Logo = styled("img")({
//   width: "30px",
//   height: "30px",
//   marginRight: "10px",
//   filter: "invert(1)", // This will turn the logo white
// });

// const ContentContainer = styled("main")(({ theme }) => ({
//   display: "flex",
//   flex: 1,
//   padding: theme.spacing(4),
//   justifyContent: "center",
//   alignItems: "center",
//   flexDirection: "column",
//   backgroundColor: "transparent",
//   [theme.breakpoints.up("md")]: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   [theme.breakpoints.down("sm")]: {
//     justifyContent: "center", // Center horizontally
//     alignItems: "center", // Center vertically
//     height: "calc(100vh - 80px)", // Adjust height minus the footer
//   },
// }));

// const RightColumn = styled("div")(({ theme }) => ({
//   flex: 1,
//   display: "none", // Hide by default (for mobile)
//   justifyContent: "center",
//   alignItems: "center",
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(4),
//   [theme.breakpoints.up("md")]: {
//     display: "flex", // Show on larger screens
//     marginTop: 0,
//   },
//   [theme.breakpoints.down("sm")]: {
//     display: "none", // Ensure it's hidden in mobile view
//   },
// }));

// const LeftColumn = styled("div")(({ theme }) => ({
//   flex: 1,
//   textAlign: "center",
//   padding: theme.spacing(2),
//   [theme.breakpoints.up("md")]: {
//     textAlign: "left",
//     paddingRight: theme.spacing(4),
//   },
//   [theme.breakpoints.down("sm")]: {
//     // Add margin or padding if needed for mobile
//     paddingTop: theme.spacing(4), // Additional spacing on top for better aesthetics
//   },
// }));

// const LeftSubsectionContainer = styled("div")(({ theme }) => ({
//   [theme.breakpoints.down("sm")]: {
//     paddingTop: theme.spacing(25), // Additional spacing on top for better aesthetics
//   },
// }));

// const LeftSubsection = styled("div")(({ theme }) => ({
//   backgroundColor: "rgb(0, 0, 0, 0.2)",
//   padding: theme.spacing(0, 1), // Additional spacing on top for better aesthetics
//   paddingBottom: theme.spacing(1), // Additional spacing on top for better aesthetics
// }));

// const Footer = styled("footer")(({ theme }) => ({
//   display: "flex",
//   padding: theme.spacing(2),
//   justifyContent: "center",
//   alignItems: "center",
//   borderTop: "1px solid #e0e0e0",
//   color: "#FFFFFF", // Light color for readability
//   backgroundColor: "transparent",
// }));

// const Title = styled("h1")(({ theme }) => ({
//   fontSize: "2.5rem",
//   fontWeight: "bold",
//   color: "#FFFFFF", // Bright white to contrast with the background
//   [theme.breakpoints.up("sm")]: {
//     fontSize: "3rem",
//   },
//   [theme.breakpoints.up("md")]: {
//     fontSize: "4rem",
//   },
//   textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Stronger shadow for better contrast
// }));

// const Subtitle = styled(Typography)(({ theme }) => ({
//   marginTop: theme.spacing(4),
//   fontSize: "1.5rem",
//   fontWeight: "bold",
//   color: "#FFFFFF", // Light pastel for a subtle contrast
//   [theme.breakpoints.up("sm")]: {
//     fontSize: "1.3rem",
//   },
//   [theme.breakpoints.up("md")]: {
//     fontSize: "1.6rem",
//   },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   textTransform: "none",
//   padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
//   backgroundColor: "#FFFFFF", // White button for contrast
//   color: "#00796B",
//   "&:hover": {
//     backgroundColor: "#FFEBEE",
//   },
//   borderRadius: "30px",
//   marginRight: theme.spacing(2),
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// }));

// const OutlinedButton = styled(Button)(({ theme }) => ({
//   textTransform: "none",
//   padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
//   color: "#FFFFFF",
//   borderColor: "#FFFFFF", // White border for subtle styling
//   borderRadius: "30px",
//   "&:hover": {
//     borderColor: "#FFEBEE",
//     color: "#FFEBEE",
//   },
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// }));

// const VideoContainer = styled("div")(({ theme }) => ({
//   width: "100%",
//   maxWidth: "600px",
//   overflow: "hidden",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// }));

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/home");
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <PageContainer>
//       <ContentContainer>
//         <LeftColumn>
//           <Title>The Linkup</Title>
//           <LeftSubsectionContainer>
//             <LeftSubsection>
//               <Subtitle>
//                 Connect with new people and organize meetups around your
//                 interests.
//               </Subtitle>
//               <Typography
//                 variant="subtitle2"
//                 component="small"
//                 sx={{ marginTop: 2, color: "#FFFFFF" }}
//               >
//                 By signing up, you agree to the{" "}
//                 <a href="/terms-of-service" style={{ color: "#ffe6ff" }}>
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a href="/privacy-policy" style={{ color: "#ffe6ff" }}>
//                   Privacy Policy
//                 </a>
//                 , including{" "}
//                 <a href="/cookie-use" style={{ color: "#ffe6ff" }}>
//                   Cookie Use
//                 </a>
//                 .
//               </Typography>
//             </LeftSubsection>
//           </LeftSubsectionContainer>
//           <div style={{ marginTop: "20px" }}>
//             <StyledButton
//               variant="contained"
//               size="large"
//               onClick={() => navigate("/sign-up")}
//             >
//               Sign Up
//             </StyledButton>
//             <OutlinedButton
//               variant="outlined"
//               size="large"
//               onClick={() => navigate("/sign-in")}
//             >
//               Log In
//             </OutlinedButton>
//           </div>
//         </LeftColumn>
//         <RightColumn>
//           <VideoContainer style={{ marginTop: 70 }}>
//             <img src={LandingPageImage} alt="screenshot" />
//           </VideoContainer>
//         </RightColumn>
//       </ContentContainer>

//       <Footer>
//         <Logo src={logoSrc} alt="The Linkup Logo" />
//         <Typography variant="body2">
//           &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
//         </Typography>
//       </Footer>
//     </PageContainer>
//   );
// };

// export default LandingPage;
