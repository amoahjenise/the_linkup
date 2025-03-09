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

const StyledStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: "transparent",
  padding: theme.spacing(3),
}));

// This is for customizing the StepLabel component
const StyledStepLabel = styled(StepLabel)(
  ({ theme, colorMode, isActive, isCompleted }) => ({
    color: isActive
      ? colorMode === "dark"
        ? "#fff" // White for active step in dark mode
        : "#000" // Black for active step in light mode
      : isCompleted
      ? colorMode === "dark"
        ? "#bbb" // Completed step color in dark mode
        : "#555" // Completed step color in light mode
      : colorMode === "dark"
      ? "#bbb" // Light gray for inactive steps in dark mode
      : "#555", // Gray for inactive steps in light mode
  })
);

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
            color: colorMode === "dark" ? "#bbb" : "#555", // Default color for inactive steps
            // Color for active step
            "&.Mui-active": {
              color: colorMode === "dark" ? "#fff" : "#000", // Active color based on the theme
            },
            // Color for completed step
            "&.Mui-completed": {
              color: colorMode === "dark" ? "#bbb" : "#555", // Completed color based on the theme
            },
          },
        },
      },
    },
  });

  return (
    <StyledStepperContainer>
      <ThemeProvider theme={theme}>
        <StyledStepper activeStep={currentStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step}>
              <StyledStepLabel
                colorMode={colorMode}
                isActive={index === currentStep} // Pass isActive instead of active
                isCompleted={index < currentStep} // Check if the step is completed
              >
                {step}
              </StyledStepLabel>
            </Step>
          ))}
        </StyledStepper>
      </ThemeProvider>
    </StyledStepperContainer>
  );
};

export default MultiStepProgressBar;
