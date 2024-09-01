import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";

const WidgetContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "sm",
  borderRadius: "24px",
  borderWidth: "1px",
  overflow: "hidden",
  padding: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
  backgroundColor: "rgba(200, 200, 200, 0.1)",
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const Icon = styled(FontAwesomeIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(120deg, #0097A7, rgba(229, 235, 243, 1))",
  "&:hover": {
    background: "linear-gradient(120deg, #007b86, rgba(229, 235, 243, 1))",
  },
  color: "#fff",
  borderRadius: "20px",
  padding: theme.spacing(1, 4),
}));

const SuggestionInput = styled(TextField)(({ theme, colorMode }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  "& .MuiInputBase-root": {
    borderRadius: "12px",
  },
  "& .MuiInputLabel-root": {
    color: "gray", // Set label color to gray
    fontFamily: "Arial, sans-serif", // Set font family
  },
  "& .MuiInputBase-input": {
    color: colorMode === "dark" ? "#fff" : "#000", // Set input text color based on color mode
    fontFamily: "Arial, sans-serif", // Set font family
  },
}));

const WhatWouldYouLikeWidget = ({ onSubmitSuggestion }) => {
  const [suggestion, setSuggestion] = useState("");

  const { colorMode } = useColorMode(); // Use Chakra UI's color mode

  const handleInputChange = (event) => {
    setSuggestion(event.target.value);
  };

  const handleSubmit = () => {
    if (suggestion.trim()) {
      onSubmitSuggestion(suggestion);
      setSuggestion(""); // Clear the input after submission
    }
  };

  return (
    <WidgetContainer>
      <Header>
        <Icon icon={faLightbulb} />
        <span>What would you like?</span>
      </Header>
      <SuggestionInput
        label="Your Suggestion"
        variant="outlined"
        value={suggestion}
        onChange={handleInputChange}
        multiline
        rows={2}
        placeholder="Tell us how we can improve..."
        colorMode={colorMode} // Pass colorMode to the styled component
      />
      <Tooltip title="Submit your suggestion">
        <SubmitButton
          onClick={handleSubmit}
          aria-label="submit-suggestion"
          size="large"
        >
          Submit
        </SubmitButton>
      </Tooltip>
    </WidgetContainer>
  );
};

export default WhatWouldYouLikeWidget;
