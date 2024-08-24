import React, { useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLinkup } from "../api/linkUpAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Tooltip, IconButton, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const WidgetContainer = styled("div")(({ theme }) => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: "rgba(200, 200, 200, 0.1)",
  borderRadius: "24px",
  borderWidth: "1px",
  border: "0.1px solid #lightgray",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
}));

const CenterElement = styled("div")({
  textAlign: "center",
});

const CreateLinkUpTitle = styled("h2")(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1, 4),
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  fontSize: "14px",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.12)"
      : "rgba(130, 131, 129, 0.12)", // Adjust background color based on mode
  width: "100%",
}));

const CreateLinkUpButton = styled("button")(({ theme }) => ({
  borderRadius: "40px",
  cursor: "pointer",
  transition: "background 0.4s ease-in-out", // Adjusted to transition the entire background
  background: "linear-gradient(120deg, #0097A7, rgba(229, 235, 243, 1))",
  fontWeight: "bold",
  color: "white",
  "&:hover": {
    background: "linear-gradient(120deg, #007b86, rgba(229, 235, 243, 1))",
  },
  width: "200px",
  height: "60px",
  marginTop: theme.spacing(2),
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  fontSize: "14px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor:
    colorMode === "dark" ? "#2e2e2e" : "rgba(130, 131, 129, 0.12)", // Adjust background color based on mode
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
  pointerEvents: "auto", // Allow clicking on the icon
  color: "lightgray",
}));

const CustomDropdown = styled("div")(({ theme, colorMode }) => ({
  fontSize: "14px",
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  color: colorMode === "dark" ? "grey" : "grey",
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  position: "relative",
  "& select": {
    width: "100%",
    padding: theme.spacing(1),
    backgroundSize: "auto 20px",
    backgroundColor:
      colorMode === "dark"
        ? "rgba(130, 131, 129, 0.12)"
        : "rgba(130, 131, 129, 0.12)", // Adjust background color based on mode
    paddingRight: "2.5rem", // Ensure room for the arrow icon
  },
  "& option": {
    color: colorMode === "dark" ? "white" : "black",
    backgroundColor: colorMode === "dark" ? "#2e2e2e" : "white",
  },
}));

const CreateLinkupWidget = ({ setShouldFetchLinkups, scrollToTopCallback }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [genderPreference, setGenderPreference] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id, name } = loggedUser?.user || {};
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode

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
    const activity = e.target.activity.value;
    const location = capitalizeFirstLetter(e.target.location.value);

    try {
      const response = await createLinkup({
        creator_id: id,
        creator_name: name,
        location: location,
        activity: activity,
        date: selectedDate,
        gender_preference: genderPreference,
        payment_option: paymentOption,
      });

      if (response.success) {
        updateLinkupList(response.newLinkup);
        addSnackbar("Link-up created successfully!");
        e.target.reset();
        setSelectedDate(null);
        setGenderPreference("");
        setPaymentOption("");
        setShouldFetchLinkups(true);
        scrollToTopCallback();
      } else {
        addSnackbar("An error occurred. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  return (
    <WidgetContainer>
      <CreateLinkUpTitle>Create a Linkup</CreateLinkUpTitle>
      <Form onSubmit={handleCreateLinkUp}>
        <InputField
          type="text"
          placeholder="Activity"
          name="activity"
          required
        />
        <InputWithIcon>
          <InputField
            type="text"
            placeholder="Location"
            name="location"
            required
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
            arrow
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: colorMode === "dark" ? "#181717" : "#f0f0f0",
                  color: colorMode === "dark" ? "#ffffff" : "#333333",
                  border: "1px solid #b3b3b3",
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
          placeholderText="Select Date and Time"
          required
          colorMode={colorMode} // Pass colorMode to styled component
        />
        <CustomDropdown colorMode={colorMode}>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Gender Preference
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </select>
        </CustomDropdown>
        <CustomDropdown colorMode={colorMode}>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
          >
            <option value="">Who Will Pay? (Optional)</option>
            <option value="split">Split The Bill</option>
            <option value="iWillPay">I Will Pay</option>
            <option value="pleasePay">Please Pay</option>
          </select>
        </CustomDropdown>
        <CenterElement>
          <CreateLinkUpButton type="submit">Post</CreateLinkUpButton>
        </CenterElement>{" "}
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
