import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { customGenderOptions } from "../../utils/customGenderOptions"; // Import the reusable gender options
import { useColorMode } from "@chakra-ui/react";

// Define styled components
const FormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}));

const Label = styled("label")(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const Input = styled("input")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  boxSizing: "border-box",
}));

const Select = styled("select")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  boxSizing: "border-box",
  appearance: "none",
}));

const SuggestionList = styled("ul")(({ theme }) => ({
  listStyleType: "none",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: 0,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  maxHeight: "150px",
  overflowY: "auto",
}));

const SuggestionItem = styled("li")(({ theme }) => ({
  padding: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ErrorMessage = styled("div")(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const FirstStep = ({ userData, setUserData }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode

  useEffect(() => {
    // Set custom input value based on userData.gender
    if (
      userData.gender &&
      userData.gender !== "Men" &&
      userData.gender !== "Women"
    ) {
      setShowCustomInput(true);
      setCustomInputValue(userData.gender);
    } else {
      setShowCustomInput(false);
      setCustomInputValue(""); // Reset if not a custom input
    }
  }, [userData.gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update date of birth or gender based on input name
    if (name === "dateOfBirth") {
      setUserData((prevUserData) => ({
        ...prevUserData,
        dateOfBirth: value,
      }));
    } else if (name === "gender") {
      if (value === "custom") {
        setShowCustomInput(true);
        setCustomInputValue(""); // Clear the custom input field
        setError(""); // Clear error message
      } else {
        setShowCustomInput(false);
        setCustomInputValue(""); // Clear the custom input field
        setUserData((prevUserData) => ({
          ...prevUserData,
          gender: value, // Set selected gender
        }));
      }
    }
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomInputValue(value);

    // Clear error message when user starts typing again
    setError("");

    // Filter suggestions based on input
    const filteredSuggestions = customGenderOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setCustomInputValue(suggestion);
    setSuggestions([]);
    setError("");

    setUserData((prevUserData) => ({
      ...prevUserData,
      gender: suggestion, // Set gender to the selected suggestion
    }));
  };

  const handleBlur = () => {
    // Check if the custom input is valid
    if (customInputValue && !customGenderOptions.includes(customInputValue)) {
      setError("The entered value is not listed yet.");
      setUserData((prevUserData) => ({
        ...prevUserData,
        gender: "", // Reset gender if input is invalid
      }));
    } else if (customInputValue) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        gender: customInputValue, // Set valid custom gender
      }));
    }
  };

  return (
    <FormContainer>
      <Label htmlFor="dateOfBirth">Date of Birth</Label>
      <Input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={userData.dateOfBirth}
        onChange={handleChange}
        max={new Date().toISOString().split("T")[0]} // Set max date to today
        required
      />
      <Label htmlFor="gender">Gender</Label>
      <Select
        id="gender"
        name="gender"
        value={userData.gender}
        onChange={handleChange}
        required
      >
        <option value="">--Select--</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="custom">Beyond Binary</option>
      </Select>

      {showCustomInput && (
        <>
          <Label htmlFor="customGender">Please specify</Label>
          <Input
            id="customGender"
            name="customGender"
            value={customInputValue}
            onChange={handleCustomInputChange}
            onBlur={handleBlur}
            required
            style={{ display: "block" }}
            autoComplete="off"
          />

          {/* Display suggestions if available */}
          {suggestions.length > 0 && (
            <SuggestionList
              style={{
                width: "100%",
                border: `1px solid ${
                  colorMode === "dark" ? "#4a4a4a" : "#ddd" // Hardcoded a light color if no theme is available
                }`,
                backgroundColor:
                  colorMode === "dark"
                    ? "rgba(130, 131, 129, 0.1)"
                    : "rgba(130, 131, 129, 0.03)",
                // color: genderPreference.length
                //   ? colorMode === "dark"
                //     ? "white"
                //     : "black"
                //   : "grey",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </SuggestionItem>
              ))}
            </SuggestionList>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </FormContainer>
  );
};

export default FirstStep;
