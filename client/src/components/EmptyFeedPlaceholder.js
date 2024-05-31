import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import sadFaceImage from "../assets/sad-face-2692.png"; // Import the PNG image
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  placeholderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: theme.spacing(10),
    textAlign: "center",
  },
  illustration: {
    width: "200px",
    height: "200px",
    marginBottom: theme.spacing(2),
    filter: "invert(1)", // Apply inversion by default
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const EmptyFeedPlaceholder = () => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  // Conditionally change the inversion based on color mode
  const imageColor = colorMode === "dark" ? "invert(1)" : "invert(0)";

  return (
    <div className={classes.placeholderContainer}>
      <img
        src={sadFaceImage} // Use the imported PNG image
        alt="Empty Feed Illustration"
        className={classes.illustration}
        style={{ filter: imageColor }} // Apply inversion based on color mode
      />

      <Typography variant="h5" className={classes.message}>
        There are no linkups available at the moment.
      </Typography>
      <Typography variant="body1">
        Start by creating a link-up to connect with others.
      </Typography>
    </div>
  );
};

export default EmptyFeedPlaceholder;
