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
import { useColorMode } from "@chakra-ui/react";
import { customGenderOptions } from "../utils/customGenderOptions";
import CustomMultiSelect from "./CustomMultiSelect"; // Import the custom MultiSelect
import CustomDropdown from "./CustomDropdown"; // Import the custom Dropdown

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
  maxWidth: "600px", // Desktop
  margin: "0 auto",
  height: "100%",
  maxHeight: "90vh", // Limit modal height
  overflowY: "auto", // Allow scrolling if content exceeds height
  boxSizing: "border-box",

  // Mobile-specific tweaks
  "@media (max-width: 600px)": {
    padding: "10px",
    maxWidth: "95%", // Reduce width on mobile
  },
});

const ModalTitle = styled("h2")(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(3),
  fontSize: "1.2rem", // Slightly smaller title size for better fit
}));

const ModalForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const ModalLabel = styled("label")({
  fontSize: "13px",
  display: "flex",
  justifyContent: "start",
  fontWeight: "bold",
  color: "#6B7280",
});

const ModalInput = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  fontSize: "14px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)" // Dark mode background
      : "rgba(130, 131, 129, 0.03)", // Light mode background
  borderRadius: "8px", // Slightly rounded corners
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`, // Border color
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  height: "40px",
  flexDirection: "row", // Stack buttons horizontally
  gap: theme.spacing(2), // Add space between buttons
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  width: "100%",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)" // Dark mode background
      : "rgba(130, 131, 129, 0.03)", // Light mode background
  borderRadius: "8px", // Slightly rounded corners
  border: `1px solid ${
    colorMode === "dark" ? "#4a4a4a" : theme.palette.divider
  }`, // Border color
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "140px",
  border: "none",
  borderRadius: "4px",
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

const ErrorText = styled("p")(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "12px",
  margin: "8px 0 0",
}));

const EditLinkupForm = ({ onClose, setShouldFetchLinkups }) => {
  const dispatch = useDispatch();
  const editingLinkup = useSelector((state) => state.editingLinkup);
  const id = editingLinkup?.linkup?.id;
  const { colorMode } = useColorMode();
  const [selectedDate, setSelectedDate] = useState(editingLinkup?.linkup?.date);
  const [activity, setActivity] = useState(editingLinkup?.linkup?.activity);
  const [location, setLocation] = useState(editingLinkup?.linkup?.location);
  const [genderPreference, setGenderPreference] = useState(
    Array.isArray(editingLinkup?.linkup?.gender_preference)
      ? editingLinkup.linkup.gender_preference
      : []
  );
  const [paymentOption, setPaymentOption] = useState(
    editingLinkup?.linkup?.payment_option || ""
  );
  const [isFormModified, setIsFormModified] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { addSnackbar } = useSnackbar();

  // Gender options for MultiSelect
  const genderOptions = [
    { key: "men", value: "Men" },
    { key: "women", value: "Women" },
    ...customGenderOptions.map((gender) => ({
      key: gender.toLowerCase(),
      value: gender,
    })),
  ];

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

  const handleUpdateLinkup = useCallback(
    async (e) => {
      e.preventDefault();

      // Reset form errors
      setFormErrors({});
      const errors = {};

      if (!activity.trim()) errors.activity = "Activity is required.";
      if (!location.trim()) errors.location = "Location is required.";
      if (!selectedDate) errors.date = "Date is required.";
      if (genderPreference.length === 0) {
        errors.genderPreference = "Please select at least one gender.";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

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
            onChange={(e) => {
              setActivity(e.target.value);
              setIsFormModified(true);
            }}
            autoComplete="off"
            required
            colorMode={colorMode}
          />
          {formErrors.activity && <ErrorText>{formErrors.activity}</ErrorText>}

          <ModalLabel htmlFor="location">Location</ModalLabel>
          <ModalInput
            type="text"
            placeholder="Location"
            name="location"
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsFormModified(true);
            }}
            autoComplete="off"
            required
            colorMode={colorMode}
          />
          {formErrors.location && <ErrorText>{formErrors.location}</ErrorText>}

          <ModalLabel htmlFor="date">Date and Time</ModalLabel>
          <DatePickerStyled
            selected={new Date(selectedDate)}
            onChange={(date) => {
              setSelectedDate(date);
              setIsFormModified(true);
            }}
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
            colorMode={colorMode}
          />
          {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}

          <ModalLabel htmlFor="genderPreference">Visible to who?</ModalLabel>
          <CustomMultiSelect
            colorMode={colorMode}
            options={genderOptions}
            selectedValues={genderPreference}
            setSelectedValues={setGenderPreference}
            placeholder="Visible to who?"
            hasError={!!formErrors.genderPreference}
          />
          {formErrors.genderPreference && (
            <ErrorText>{formErrors.genderPreference}</ErrorText>
          )}

          <ModalLabel htmlFor="paymentOption">
            Who's Paying? (Optional)
          </ModalLabel>
          <CustomDropdown
            options={[
              { label: "No Payment Option", value: "" },
              { label: "Split The Bill", value: "split" },
              { label: "I Will Pay", value: "iWillPay" },
              { label: "Please Pay", value: "pleasePay" },
            ]}
            value={paymentOption}
            onChange={(val) => {
              setPaymentOption(val);
              setIsFormModified(true);
            }}
            placeholder="Who's Paying?"
            colorMode={colorMode}
          />

          <ButtonGroup>
            <StyledButton type="submit" variant="contained">
              Save Changes
            </StyledButton>
            <CancelButton variant="outlined" onClick={handleCancelClick}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditLinkupForm;
