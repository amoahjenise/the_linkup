import React from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  loadingSpinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // Center vertically within the container
    width: "100%", // Center horizontally within the container
  },
}));

const LoadingSpinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.loadingSpinnerContainer}>
      <CircularProgress size={48} />
    </div>
  );
};

export default LoadingSpinner;
