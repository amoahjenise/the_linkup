import React from "react";
import {
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  customStepper: {
    color: "white",
    backgroundColor: "transparent",
    padding: theme.spacing(3),
  },
  activeStep: {
    fontWeight: "bold",
    color: "white",
  },
}));

const MultiStepProgressBar = () => {
  const { colorMode } = useColorMode();
  const classes = useStyles({ colorMode });
  const currentStep = useSelector((state) => state.registration.currentStep);
  const steps = useSelector((state) => state.registration.steps);

  const theme = createTheme({
    overrides: {
      MuiStepLabel: {
        label: {
          color: (props) => (props.colorMode === "dark" ? "#000" : "black"),
        },
      },
    },
  });

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          style={{
            backgroundColor:
              colorMode === "dark" ? "transparent" : "transparent",
            color: colorMode === "dark" ? "#000" : "black",
          }}
        >
          {steps.map((step, index) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </ThemeProvider>
    </div>
  );
};

export default MultiStepProgressBar;
