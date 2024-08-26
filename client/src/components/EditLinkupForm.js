import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateLinkup } from "../api/linkUpAPI";
import { updateLinkupSuccess } from "../redux/actions/linkupActions";
import { clearEditingLinkup } from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";

const ModalOverlay = styled("div")({
  flex: "1",
  position: "sticky",
  top: 0,
  width: "100%",
});

const ModalContainer = styled("div")({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "sticky",
  top: 0,
});

const ModalTitle = styled("h2")(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(3),
}));

const ModalForm = styled("form")({
  display: "flex",
  flexDirection: "column",
});

const ModalLabel = styled("label")({
  fontSize: "13px",
  display: "flex",
  justifyContent: "start",
  fontWeight: "bold",
  color: "#6B7280",
});

const ModalInput = styled("input")(({ theme }) => ({
  width: "100%",
  fontSize: "14px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  height: "40px",
}));

const DatePickerStyled = styled(DatePicker)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomDropdown = styled("div")(({ theme }) => ({
  fontSize: "14px",
  position: "relative",
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  "& select": {
    width: "100%",
    padding: theme.spacing(1),
    border: "1px solid transparent", // Remove border when not in focus
    appearance: "none",
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 8.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`,
    backgroundPosition: "right 12px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 20px",
    paddingRight: "2.5rem",
    "&:focus": {
      border: "none", // Ensure border stays removed on focus
      outline: "none", // Remove the outline when focused
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "140px",
  border: "none",
  borderRadius: "4px",
  marginRight: "10%",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  backgroundColor: "#0097A7",
  color: "white",
  "&:hover": {
    backgroundColor: "#007b86",
  },
}));

const CancelButton = styled(Button)({
  width: "140px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#f5f5f5",
  color: "#9e9e9e",
  "&:hover": {
    backgroundColor: "#e0e0e0",
    color: "#000",
  },
});

const EditLinkupForm = ({ onClose, setShouldFetchLinkups }) => {
  const dispatch = useDispatch();
  const editingLinkup = useSelector((state) => state.editingLinkup);
  const id = editingLinkup?.linkup?.id;

  const [selectedDate, setSelectedDate] = useState(editingLinkup?.linkup?.date);
  const [activity, setActivity] = useState(editingLinkup?.linkup?.activity);
  const [location, setLocation] = useState(editingLinkup?.linkup?.location);
  const [genderPreference, setGenderPreference] = useState(
    editingLinkup?.linkup?.gender_preference
  );
  const [paymentOption, setPaymentOption] = useState(
    editingLinkup?.linkup?.payment_option || ""
  );

  const [isFormModified, setIsFormModified] = useState(false);
  const { addSnackbar } = useSnackbar();

  const maxTime = new Date();
  maxTime.setHours(23);
  maxTime.setMinutes(45);

  const minTimeDefault = new Date();
  minTimeDefault.setHours(0);
  minTimeDefault.setMinutes(0);

  const currentDate = new Date();
  const minTime = selectedDate
    ? new Date(selectedDate).toDateString() === currentDate.toDateString()
      ? currentDate
      : minTimeDefault
    : currentDate;

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
    setIsFormModified(true);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setIsFormModified(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsFormModified(true);
  };

  const handleGenderPreferenceChange = (e) => {
    setGenderPreference(e.target.value);
    setIsFormModified(true);
  };

  const handleUpdateLinkup = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormModified) {
        onClose();
        dispatch(clearEditingLinkup());
        addSnackbar("No changes were made.");
        return;
      }

      const updatedLinkup = {
        location,
        activity,
        date: selectedDate,
        gender_preference: genderPreference,
        payment_option: paymentOption,
      };

      try {
        const response = await updateLinkup(id, updatedLinkup);

        if (response.success) {
          setShouldFetchLinkups(true);
          dispatch(updateLinkupSuccess(response.linkup));
          onClose();
          dispatch(clearEditingLinkup());
          addSnackbar("Updated successfully!");
        }
      } catch (error) {
        addSnackbar(error.message);
      }
    },
    [
      isFormModified,
      location,
      activity,
      selectedDate,
      genderPreference,
      paymentOption,
      onClose,
      dispatch,
      addSnackbar,
      id,
      setShouldFetchLinkups,
    ]
  );

  const handleCancelClick = useCallback(() => {
    dispatch(clearEditingLinkup());
    onClose();
  }, [dispatch, onClose]);

  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
    setIsFormModified(true);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>Edit Linkup</ModalTitle>
        <ModalForm onSubmit={handleUpdateLinkup}>
          <ModalLabel htmlFor="activity">Activity</ModalLabel>
          <ModalInput
            type="text"
            placeholder="Activity"
            name="activity"
            id="activity"
            value={activity}
            onChange={handleActivityChange}
            required
          />
          <ModalLabel htmlFor="location">Location</ModalLabel>
          <ModalInput
            type="text"
            placeholder="Location"
            name="location"
            id="location"
            value={location}
            onChange={handleLocationChange}
            required
          />
          <ModalLabel htmlFor="date">Date and Time</ModalLabel>
          <DatePickerStyled
            selected={new Date(selectedDate)}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            minTime={minTime}
            maxTime={maxTime}
            placeholderText="Select Date and Time"
            id="date"
            required
          />
          <ModalLabel htmlFor="genderPreference">Gender Preference</ModalLabel>
          <CustomDropdown>
            <select
              value={genderPreference}
              onChange={handleGenderPreferenceChange}
              aria-label="Gender Preference"
              id="genderPreference"
              required
            >
              <option value="">Select Gender Preference</option>{" "}
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </CustomDropdown>
          <ModalLabel htmlFor="paymentOption">Payment Option</ModalLabel>
          <CustomDropdown>
            <select
              value={paymentOption}
              onChange={handlePaymentOptionChange}
              aria-label="Payment Option"
              id="paymentOption"
            >
              <option value="">Who's Paying? (Optional)</option>{" "}
              <option value="split">Split The Bill</option>
              <option value="iWillPay">I Will Pay</option>
              <option value="pleasePay">Please Pay</option>
            </select>
          </CustomDropdown>
          <ButtonGroup>
            <StyledButton type="submit">Update</StyledButton>
            <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditLinkupForm;
