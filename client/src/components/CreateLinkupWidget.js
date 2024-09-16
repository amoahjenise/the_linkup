import React, { useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLinkup } from "../api/linkUpAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Tooltip, IconButton, Button, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useColorMode } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

// Styled components
const WidgetContainer = styled("div")(({ theme }) => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2, 0),
  backgroundColor: "rgba(200, 200, 200, 0.1)",
  borderRadius: "24px",
  borderWidth: "1px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
  fontFamily: "Arial, sans-serif", // Set font family
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(1),
}));

const Icon = styled(FontAwesomeIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const CenterElement = styled("div")({
  textAlign: "center",
});

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1, 4),
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
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
      : "rgba(130, 131, 129, 0.12)",
  width: "100%",
}));

const CreateLinkUpButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(20deg, #0097A7, rgba(229, 235, 243, 1))",
  "&:hover": {
    background: "linear-gradient(20deg, #007b86, rgba(229, 235, 243, 1))",
  },
  color: "#fff",
  borderRadius: "20px",
  padding: theme.spacing(1, 4),
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
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
    colorMode === "dark" ? "#2e2e2e" : "rgba(130, 131, 129, 0.12)",
  fontFamily: "Arial, sans-serif", // Set font family
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

const CustomDropdown = styled("div")(({ theme, colorMode }) => ({
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
        : "rgba(130, 131, 129, 0.12)",
    paddingRight: "2.5rem",
  },
  "& option": {
    color: colorMode === "dark" ? "white" : "black",
    backgroundColor: colorMode === "dark" ? "#2e2e2e" : "white",
  },
  fontFamily: "Arial, sans-serif", // Set font family
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
        />
        <InputWithIcon>
          <InputField
            type="text"
            placeholder="Location"
            name="location"
            autoComplete="off" // Disable autocomplete
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
          placeholderText="Date and Time"
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
              Gender Preference
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
            <option value="">Who's Paying? (Optional)</option>
            <option value="split">Split The Bill</option>
            <option value="iWillPay">I Will Pay</option>
            <option value="pleasePay">Please Pay</option>
          </select>
        </CustomDropdown>
        <CenterElement>
          <CreateLinkUpButton
            type="submit"
            aria-label="create-linkup"
            size="large"
          >
            POST
          </CreateLinkUpButton>
        </CenterElement>{" "}
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
