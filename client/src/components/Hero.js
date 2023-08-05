import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({}));

const Hero = ({ handleCreateAccountClick }) => {
  const classes = useStyles();

  return <div className={classes.hero}></div>;
};

export default Hero;
