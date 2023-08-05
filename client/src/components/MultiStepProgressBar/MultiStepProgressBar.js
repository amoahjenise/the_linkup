import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

const MultiStepProgressBar = () => {
  const classes = useStyles();
  const currentStep = useSelector((state) => state.registration.currentStep);
  const steps = useSelector((state) => state.registration.steps);

  return (
    <div className={classes.root}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default MultiStepProgressBar;
