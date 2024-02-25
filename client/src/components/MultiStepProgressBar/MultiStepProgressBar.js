import React from "react";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { useSelector } from "react-redux";

const theme = createTheme({
  overrides: {
    MuiStepLabel: {
      label: {
        color: (props) => (props.colorMode === "dark" ? "white" : "black"),
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  customStepper: {
    backgroundColor: "transparent",
    padding: theme.spacing(3),
  },
  activeStep: {
    fontWeight: "bold",
    color: "green",
  },
}));

const MultiStepProgressBar = ({ colorMode }) => {
  const classes = useStyles({ colorMode });
  const currentStep = useSelector((state) => state.registration.currentStep);
  const steps = useSelector((state) => state.registration.steps);

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          className={classes.customStepper}
        >
          {steps.map((step, index) => (
            <Step key={step}>
              <StepLabel classes={{ active: classes.activeStep }}>
                {step}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </ThemeProvider>
    </div>
  );
};

export default MultiStepProgressBar;
