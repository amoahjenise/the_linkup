import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "../DatePicker.css"; // Import default styles
import { createLinkup } from "../api/linkUpAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Tooltip, IconButton, Button, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useColorMode } from "@chakra-ui/react";
import { customGenderOptions } from "../utils/customGenderOptions"; // Import the reusable gender options
import { PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import LoadingSpinner from "./LoadingSpinner";
import CustomDropdown from "./CustomDropdown";
import CustomMultiSelect from "./CustomMultiSelect";

// Styled components for iOS-like design
const WidgetContainer = styled("div")(({ theme, colorMode }) => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  maxWidth: "310px",
  borderRadius: "16px",
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  boxShadow:
    colorMode === "dark"
      ? "0 4px 12px rgba(255, 255, 255, 0.08)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow:
      colorMode === "dark"
        ? "0 8px 24px rgba(255, 255, 255, 0.15)"
        : "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
  backgroundColor: colorMode === "dark" ? "rgba(200, 200, 200, 0.1)" : "white",
}));

const Header = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  fontWeight: "700",
  fontSize: "20px",
  letterSpacing: "0.5px",
  textTransform: "capitalize",
  color: colorMode === "dark" ? "#00E5FF" : "#007B86",
  background:
    colorMode === "dark"
      ? "linear-gradient(90deg, #00E5FF, #0097A7)"
      : "linear-gradient(90deg, #007B86, #0097A7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    colorMode === "dark"
      ? "0px 2px 10px rgba(0, 229, 255, 0.4)"
      : "0px 1px 4px rgba(0, 123, 134, 0.2)",
  cursor: "default",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1, 4),
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  width: "100%",
  padding: theme.spacing(1), // Match padding with InputField
  fontFamily: "Arial, sans-serif", // Consistent font family
  fontWeight: 400, // Consistent font weight
  paddingLeft: theme.spacing(2), // Align text within inputs
  marginBottom: theme.spacing(2),
  color: colorMode === "dark" ? "#FFFFFF" : "#000000", // Text color
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)" // Dark mode background
      : "rgba(130, 131, 129, 0.03)", // Light mode background
  borderRadius: "8px", // Slightly rounded corners
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`, // Border color
  outline: "none", // Remove default outline
  transition: "all 0.3s ease", // Smooth transitions for all properties
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth

  // Focus state
  "&:focus": {
    borderColor: theme.palette.primary.main, // Highlight border on focus
    boxShadow: `0 0 0 3px ${
      colorMode === "dark"
        ? "rgba(0, 123, 255, 0.25)" // Dark mode focus shadow
        : "rgba(0, 123, 255, 0.25)" // Light mode focus shadow
    }`,
  },

  // Placeholder styling
  "&::placeholder": {
    color: colorMode === "dark" ? "#B0B0B0" : "#808080", // Placeholder text color
    opacity: 1, // Ensure placeholder is fully visible
  },

  // Hover state
  "&:hover": {
    borderColor: theme.palette.primary.main, // Highlight border on hover
  },

  // Disabled state
  "&:disabled": {
    backgroundColor:
      colorMode === "dark"
        ? "rgba(130, 131, 129, 0.05)" // Dark mode disabled background
        : "rgba(130, 131, 129, 0.02)", // Light mode disabled background
    color: colorMode === "dark" ? "#B0B0B0" : "#808080", // Disabled text color
    cursor: "not-allowed", // Change cursor for disabled state
  },
}));

const CreateLinkUpButton = styled(Button)(({ theme }) => ({
  background: "#0097A7",
  "&:hover": {
    background: "#007b86",
  },
  color: "#fff",
  borderRadius: "20px",
  padding: theme.spacing(1, 4),
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  padding: theme.spacing(1), // Slightly larger padding for better spacing
  fontFamily: "Arial, sans-serif", // Consistent font family
  fontWeight: 400, // Consistent font weight
  paddingLeft: theme.spacing(2), // Align text within inputs
  marginBottom: theme.spacing(2),
  color: colorMode === "dark" ? "#FFFFFF" : "#000000", // Text color
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)" // Dark mode background
      : "rgba(130, 131, 129, 0.03)", // Light mode background
  borderRadius: "8px", // Slightly rounded corners
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`, // Border color
  outline: "none", // Remove default outline
  transition: "all 0.3s ease", // Smooth transitions for all properties
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth

  // Focus state
  "&:focus": {
    borderColor: theme.palette.primary.main, // Highlight border on focus
    boxShadow: `0 0 0 3px ${
      colorMode === "dark"
        ? "rgba(0, 123, 255, 0.25)" // Dark mode focus shadow
        : "rgba(0, 123, 255, 0.25)" // Light mode focus shadow
    }`,
  },

  // Placeholder styling
  "&::placeholder": {
    color: colorMode === "dark" ? "#B0B0B0" : "#808080", // Placeholder text color
    opacity: 1, // Ensure placeholder is fully visible
  },

  // Hover state
  "&:hover": {
    borderColor: theme.palette.primary.main, // Highlight border on hover
  },

  // Disabled state
  "&:disabled": {
    backgroundColor:
      colorMode === "dark"
        ? "rgba(130, 131, 129, 0.05)" // Dark mode disabled background
        : "rgba(130, 131, 129, 0.02)", // Light mode disabled background
    color: colorMode === "dark" ? "#B0B0B0" : "#808080", // Disabled text color
    cursor: "not-allowed", // Change cursor for disabled state
  },
}));

const InputWithIcon = styled("div")({
  position: "relative",
  display: "flex",
});

const InfoIconStyled = styled(IconButton)(({ theme }) => ({
  width: "0%",
  height: "50%",
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(0.8),
  pointerEvents: "auto",
  color: "lightgray",
}));

const ErrorText = styled("p")(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "12px",
  margin: "8px 0 4px 8px", // Consistent margin with standard input errors
}));

const CreateLinkupWidget = ({
  toggleWidget,
  setShouldFetchLinkups,
  scrollToTopCallback,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [genderPreference, setGenderPreference] = useState([]);
  const [paymentOption, setPaymentOption] = useState(null);
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id, name } = loggedUser?.user || {};
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode
  const { changeTheme } = useContext(PrimeReactContext);
  const [currentTheme, setCurrentTheme] = useState(""); // Initialize as an empty string
  const [formErrors, setFormErrors] = useState({}); // Track form errors
  const [isLoading, setIsLoading] = useState(false); // Initialize as false (boolean)

  const paymentOptions = [
    { label: "No Payment Option", value: "" },
    { label: "Split The Bill", value: "split" },
    { label: "I Will Pay", value: "iWillPay" },
    { label: "Please Pay", value: "pleasePay" },
  ];

  useEffect(() => {
    const applyTheme = async () => {
      // setIsLoading(true); // Set loading state to true
      try {
        const themeLink = document.getElementById("theme-link");
        const initialTheme = themeLink.getAttribute("href").includes("dark")
          ? "bootstrap4-dark-blue"
          : "bootstrap4-light-blue";
        setCurrentTheme(initialTheme);

        const newTheme =
          colorMode === "dark"
            ? "bootstrap4-dark-blue"
            : "bootstrap4-light-blue";

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Change the theme and wait for it to complete
        await new Promise((resolve) => {
          changeTheme(initialTheme, newTheme, "theme-link", () => {
            setCurrentTheme(newTheme);
            resolve();
          });
        });
      } catch (error) {
        console.error("Error applying theme:", error);
      } finally {
        setIsLoading(false); // Reset loading state regardless of success or failure
      }
    };

    applyTheme(); // Call the async function
  }, [colorMode, changeTheme]);

  const maxTime = new Date();
  maxTime.setHours(23);
  maxTime.setMinutes(45);

  const minTimeDefault = new Date();
  minTimeDefault.setHours(0);
  minTimeDefault.setMinutes(0);

  const currentDate = new Date();
  const minTime = selectedDate
    ? selectedDate.toDateString() === currentDate.toDateString()
      ? currentDate
      : minTimeDefault
    : currentDate;

  const handleCreateLinkUp = async (e) => {
    e.preventDefault();

    // Reset form errors
    setFormErrors({});

    // Custom validation
    const errors = {};
    if (genderPreference.length === 0) {
      errors.genderPreference = "Please select at least one gender preference.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // If valid, proceed with submission
    try {
      const response = await createLinkup({
        creator_id: id,
        creator_name: name,
        location: e.target.location.value,
        activity: e.target.activity.value,
        date: selectedDate,
        gender_preference: genderPreference,
        payment_option: paymentOption,
      });

      if (response.success) {
        updateLinkupList(response.newLinkup);
        addSnackbar("Linkup created successfully!");
        e.target.reset();
        setSelectedDate(null);
        setGenderPreference([]);
        setPaymentOption(null);
        // Only toggle the widget in mobile view
        if (window.innerWidth <= 600) {
          toggleWidget();
        }
        setShouldFetchLinkups(true);
        scrollToTopCallback();
      } else {
        addSnackbar("An error occurred. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const handleFocus = (e) => {
    e.target.readOnly = true; // Make the input field read-only
    e.target.blur(); // Blur the input field to prevent the keyboard from opening
  };

  const placeholderStyle = {
    color: colorMode === "dark" ? "#B0B0B0" : "#808080", // Placeholder text color
    opacity: 1, // Ensure placeholder is fully visible
    fontWeight: 450,
    fontFamily: "'Inter', sans-serif", // Match InputField placeholder font
  };

  // Gender options for MultiSelect
  const genderOptions = [
    { key: "men", value: "Men" },
    { key: "women", value: "Women" },
    ...customGenderOptions.map((gender) => ({
      key: gender.toLowerCase(),
      value: gender,
    })),
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <WidgetContainer colorMode={colorMode}>
      <style>
        {` 
                    ::placeholder { 
                        color: grey; 
                    }`}
      </style>
      <Header>
        <span>Create Linkup</span>
      </Header>
      <Form onSubmit={handleCreateLinkUp}>
        <InputField
          type="text"
          placeholder="Activity"
          name="activity"
          autoComplete="off" // Disable autocomplete
          required
          colorMode={colorMode}
        />
        <InputWithIcon>
          <InputField
            type="text"
            placeholder="Location"
            name="location"
            autoComplete="off" // Disable autocomplete
            required
            colorMode={colorMode}
          />
          <Tooltip
            title={
              <Typography fontSize={16}>
                Please be cautious when specifying a location. Be aware of
                untrusted individuals to prevent uninvited or harmful people
                from attending. We recommend using a vague public location and
                sharing more specific details only when chatting directly with
                trusted individuals.
              </Typography>
            }
            open={tooltipOpen}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            onTouchStart={() => setTooltipOpen(true)} // Open on touch
            onClick={() => setTooltipOpen((prev) => !prev)} // Toggle on click
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: colorMode === "dark" ? "#181717" : "#f0f0f0",
                  color: colorMode === "dark" ? "#ffffff" : "#333333",
                  border: "1px solid #b3b3b3",
                },
              },
              popper: {
                sx: {
                  zIndex: 20000,
                },
              },
            }}
          >
            <InfoIconStyled size="large">
              <InfoIcon />
            </InfoIconStyled>
          </Tooltip>
        </InputWithIcon>
        <DatePickerStyled
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()} // Set the minimum date to the current date
          minTime={minTime} // Set the minimum time to the current time
          maxTime={maxTime}
          placeholderText="Date and Time"
          required
          colorMode={colorMode} // Pass colorMode to styled component
          onFocus={handleFocus}
        />
        {/* MultiSelect for gender preference */}
        <CustomMultiSelect
          colorMode={colorMode}
          options={genderOptions}
          selectedValues={genderPreference}
          setSelectedValues={setGenderPreference}
          placeholder="Visible to Whom?"
          placeholderStyle={placeholderStyle}
          hasError={!!formErrors.genderPreference}
        />
        {formErrors.genderPreference && (
          <ErrorText>{formErrors.genderPreference}</ErrorText>
        )}
        <CustomDropdown
          options={paymentOptions}
          value={paymentOption} // a string like "host"
          onChange={(val) => setPaymentOption(val)} // gets the value string
          placeholder="Who's Paying?"
          placeholderStyle={placeholderStyle}
          colorMode={colorMode}
        />
        <CreateLinkUpButton
          type="submit"
          aria-label="create-linkup"
          size="large"
        >
          POST
        </CreateLinkUpButton>
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
