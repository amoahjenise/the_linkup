import React from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Stepper, Step, StepLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";

// Styled components using MUI's styled API
const StyledStepperContainer = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledStepper = styled(Stepper)(({ theme, colorMode }) => ({
  color: colorMode === "dark" ? "#000" : "black",
  backgroundColor: "transparent",
  padding: theme.spacing(3),
}));

const StyledStepLabel = styled(StepLabel)(({ theme, colorMode }) => ({
  color: colorMode === "dark" ? "#000" : "black",
}));

const MultiStepProgressBar = () => {
  const { colorMode } = useColorMode();
  const currentStep = useSelector((state) => state.registration.currentStep);
  const steps = useSelector((state) => state.registration.steps);

  // Create a theme to override default MUI styles
  const theme = createTheme({
    components: {
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: colorMode === "dark" ? "#000" : "black",
          },
        },
      },
    },
  });

  return (
    <StyledStepperContainer>
      <ThemeProvider theme={theme}>
        <StyledStepper
          activeStep={currentStep}
          alternativeLabel
          colorMode={colorMode}
        >
          {steps.map((step, index) => (
            <Step key={step}>
              <StyledStepLabel>{step}</StyledStepLabel>
            </Step>
          ))}
        </StyledStepper>
      </ThemeProvider>
    </StyledStepperContainer>
  );
};

export default MultiStepProgressBar;
