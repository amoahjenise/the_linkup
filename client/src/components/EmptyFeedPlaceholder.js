import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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

  return (
    <div className={classes.placeholderContainer}>
      <img
        src="https://source.unsplash.com/200x200/?white"
        alt="Empty Feed Illustration"
        className={classes.illustration}
      />

      <Typography variant="h5" className={classes.message}>
        There are no linkups available at the moment.
      </Typography>
      <Typography variant="body1">
        Start by creating a linkup to connect with others.
      </Typography>
    </div>
  );
};

export default EmptyFeedPlaceholder;
