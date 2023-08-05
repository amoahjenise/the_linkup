import React from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
}));

const LoadingSpinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.loadingSpinner}>
      <CircularProgress size={24} />
    </div>
  );
};

export default LoadingSpinner;
