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

const DatePickerStyled = styled(DatePicker)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: "24px",
  border: "1px solid #ccc", // Add border style
  width: "100%",
}));

const CreateLinkUpButton = styled("button")(({ theme }) => ({
  borderRadius: "40px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  backgroundColor: "#0097A7",
  fontWeight: "bold",
  color: "white",
  "&:hover": {
    backgroundColor: "#007b86", // Slightly darker color on hover
  },
  width: "200px",
  height: "60px",
  marginTop: theme.spacing(2),
}));

const InputField = styled("input")(({ theme }) => ({
  width: "100%",
  fontSize: "14px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor: "rgba(130, 131, 129, 0.12)", // Slightly darker color on hover
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

const CustomDropdown = styled("div")(({ theme }) => ({
  fontSize: "14px",
  position: "relative",
  "& select": {
    width: "100%",
    padding: theme.spacing(1),
    backgroundSize: "auto 20px",
    paddingRight: "2.5rem", // Ensure room for the arrow icon
  },
  "& option": {
    backgroundColor: "rgba(64, 64, 64, 2)", // Darker color for the options
    color: "#FFFFFF", // Ensure text is readable
  },
}));

const CreateLinkupWidget = ({ setShouldFetchLinkups, scrollToTopCallback }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [genderPreference, setGenderPreference] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id, name } = loggedUser?.user || {};
  const { addSnackbar } = useSnackbar();

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
    const activity = e.target.activity.value;
    const location = e.target.location.value;

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
      <CreateLinkUpTitle>Create a Link-Up</CreateLinkUpTitle>
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
              <Typography fontSize={30}>
                The location of your linkup event will be visible to users whose
                requests you have accepted.
              </Typography>
            }
            arrow
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
          placeholderText="Select date and time"
          required
        />
        <CustomDropdown>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className={InputField.className}
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
        <CustomDropdown>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className={InputField.className}
          >
            <option value="">Payment Option (Optional)</option>
            <option value="split">Split The Bill</option>
            <option value="iWillPay">I Will Pay</option>
            <option value="pleasePay">Please Pay</option>
          </select>
        </CustomDropdown>
        <CenterElement>
          <CreateLinkUpButton type="submit">Create</CreateLinkUpButton>
        </CenterElement>
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
