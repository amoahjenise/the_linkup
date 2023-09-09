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

const LoadingSpinner = ({ marginTop }) => {
  const classes = useStyles();

  const containerStyle = {
    marginTop: marginTop || "0px", // Use the provided marginTop or default to "100px"
  };

  return (
    <div className={classes.loadingSpinnerContainer} style={containerStyle}>
      <CircularProgress size={48} />
    </div>
  );
};

export default LoadingSpinner;
