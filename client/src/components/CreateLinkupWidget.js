import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import { createLinkup } from "../api/linkUpAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Tooltip, IconButton, Button, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useColorMode } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "primereact/multiselect";
import { customGenderOptions } from "../utils/customGenderOptions"; // Import the reusable gender options
import { PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";

// Styled components for iOS-like design
const WidgetContainer = styled("div")(({ theme, colorMode }) => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: "24px",
  borderWidth: "1px",
  transition: "box-shadow 0.3s ease",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
  color: theme.palette.text.primary,
  "&:hover": {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  backgroundColor: colorMode === "dark" ? "rgba(200, 200, 200, 0.1)" : "white",
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: "#0097A7",
  fontWeight: "600",
  fontSize: "18px",
}));

const Icon = styled(FontAwesomeIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: "#0097A7",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1, 4),
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(1.5), // Align text within inputs
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)"
      : "rgba(130, 131, 129, 0.03)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  width: "100%",
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

const CustomDropdown = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  padding: theme.spacing(1),
  fontFamily: "Arial, sans-serif", // Consistent font family
  fontWeight: 400, // Consistent font weight
  paddingLeft: theme.spacing(1.5), // Align text within inputs
  marginBottom: theme.spacing(2),
  color: colorMode === "dark" ? "white" : "black", // Text color
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)"
      : "rgba(130, 131, 129, 0.03)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
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
  margin: "8px 0 0",
}));

const CreateLinkupWidget = ({
  setIsWidgetVisible = () => {}, // Default function to do nothing
  setShouldFetchLinkups,
  scrollToTopCallback,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [genderPreference, setGenderPreference] = useState([]);
  const [paymentOption, setPaymentOption] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id, name } = loggedUser?.user || {};
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode
  const { changeTheme } = useContext(PrimeReactContext);
  const [currentTheme, setCurrentTheme] = useState(""); // Initialize as an empty string
  const [formErrors, setFormErrors] = useState({}); // Track form errors

  useEffect(() => {
    const themeLink = document.getElementById("theme-link");
    const initialTheme = themeLink.getAttribute("href").includes("dark")
      ? "bootstrap4-dark-blue"
      : "bootstrap4-light-blue";
    setCurrentTheme(initialTheme);

    const newTheme =
      colorMode === "dark" ? "bootstrap4-dark-blue" : "bootstrap4-light-blue";

    changeTheme(initialTheme, newTheme, "theme-link", () => {
      setCurrentTheme(newTheme);
    });
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

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
        setPaymentOption("");
        setIsWidgetVisible(false);
        setShouldFetchLinkups(true);
        scrollToTopCallback();
      } else {
        addSnackbar("An error occurred. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  // Gender options for MultiSelect
  const genderOptions = [
    { key: "man", value: "Man" },
    { key: "woman", value: "Woman" },
    ...customGenderOptions.map((gender) => ({
      key: gender.toLowerCase(),
      value: gender,
    })),
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <WidgetContainer colorMode={colorMode}>
      <style>
        {` 
                    ::placeholder { 
                        color: grey; 
                    }`}
      </style>
      <Header>
        <Icon icon={faPlusCircle} />
        <span>Create a Linkup</span>
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
        />
        {/* MultiSelect for gender preference */}
        <CustomDropdown>
          <MultiSelect
            id="gender-preference"
            value={genderPreference}
            options={genderOptions}
            onChange={(e) => setGenderPreference(e.value)}
            optionLabel="value"
            placeholder="Visible to who?"
            className={`p-multiselect ${
              formErrors.genderPreference ? "error" : ""
            }`}
            style={{
              width: "100%", // Ensure full width
              maxWidth: "400px", // Set a max width to prevent overflow
              overflow: "hidden", // Prevent overflow
              whiteSpace: "nowrap", // Prevent wrapping
              textOverflow: "ellipsis", // Add ellipsis for overflow text
              border: `1px solid ${colorMode === "dark" ? "#4a4a4a" : "#ddd"}`,
              backgroundColor:
                colorMode === "dark"
                  ? "rgba(130, 131, 129, 0.1)"
                  : "rgba(130, 131, 129, 0.03)",
              color: genderPreference.length
                ? colorMode === "dark"
                  ? "white"
                  : "black"
                : "grey",
            }}
            // Add a dropdown style for scrolling if needed
            itemTemplate={(option) => (
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {option.value}
              </div>
            )}
          />
          {/* Display error message if no gender is selected */}
          {formErrors.genderPreference && (
            <ErrorText>{formErrors.genderPreference}</ErrorText>
          )}
        </CustomDropdown>
        <CustomDropdown>
          <Dropdown
            value={paymentOption}
            options={[
              { label: "", value: "" },
              { label: "Split The Bill", value: "split" },
              { label: "I Will Pay", value: "iWillPay" },
              { label: "Please Pay", value: "pleasePay" },
            ]}
            onChange={(e) => setPaymentOption(e.value)}
            placeholder="Who's Paying?"
            className="w-full md:w-14rem"
            style={{
              width: "100%",
              border: `1px solid ${
                colorMode === "dark" ? "#4a4a4a" : "#ddd" // Hardcoded a light color if no theme is available
              }`,
              backgroundColor:
                colorMode === "dark"
                  ? "rgba(130, 131, 129, 0.1)"
                  : "rgba(130, 131, 129, 0.03)",
              color: genderPreference.length
                ? colorMode === "dark"
                  ? "white"
                  : "black"
                : "grey",
            }}
          />
        </CustomDropdown>

        {/* <CenterElement> */}
        <CreateLinkUpButton
          type="submit"
          aria-label="create-linkup"
          size="large"
        >
          POST
        </CreateLinkUpButton>
        {/* </CenterElement>{" "} */}
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
