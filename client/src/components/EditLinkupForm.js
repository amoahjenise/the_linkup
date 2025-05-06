import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateLinkup as updateLinkupDB } from "../api/linkUpAPI";
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
  maxWidth: "350px", // Desktop
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
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: colorMode === "dark" ? "#202327" : "#F7F9F9",
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    borderColor: colorMode === "dark" ? "#4E5155" : "#D6D9DB",
  },
  "&:focus": {
    borderColor: "#0097A7",
    boxShadow: `0 0 0 2px ${
      colorMode === "dark" ? "rgba(0, 151, 167, 0.2)" : "rgba(0, 151, 167, 0.1)"
    }`,
  },
  "&::placeholder": {
    color: colorMode === "dark" ? "#71767B" : "#8B98A5",
  },
  marginBottom: theme.spacing(1.5),
}));

// ButtonGroup with improved button sizing
const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(4),
  width: "100%",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    position: "sticky",
    bottom: 0,
    padding: theme.spacing(2, 0),
    backgroundColor: "inherit",
  },
}));

// StyledButton with better visual hierarchy
const StyledButton = styled(Button)(({ theme, colorMode, isCancel }) => ({
  minWidth: 100,
  padding: theme.spacing(1.5, 2),
  borderRadius: 9999,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
  ...(isCancel
    ? {
        color: colorMode === "dark" ? "#E0E0E0" : "#333333",
        backgroundColor: colorMode === "dark" ? "#333333" : "#F0F0F0",
        "&:hover": {
          backgroundColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
        },
      }
    : {
        backgroundColor: colorMode === "dark" ? "#0097A7" : "#1DA1F2",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: colorMode === "dark" ? "#007b86" : "#1991DB",
        },
      }),
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  width: "100%",
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: colorMode === "dark" ? "#202327" : "#F7F9F9",
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&:focus": {
    borderColor: "#0097A7",
    boxShadow: `0 0 0 2px ${
      colorMode === "dark" ? "rgba(0, 151, 167, 0.2)" : "rgba(0, 151, 167, 0.1)"
    }`,
  },
  marginBottom: theme.spacing(1.5),
  "&:hover": {
    borderColor: colorMode === "dark" ? "#4E5155" : "#D6D9DB",
  },
  cursor: "pointer",
}));

const ErrorText = styled("p")(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "12px",
  margin: "8px 0 0",
}));

const EditLinkupForm = ({ onClose, updateLinkup }) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id || {};
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

  // Create hook for this function
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

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
        id,
        location,
        activity,
        date: selectedDate,
        gender_preference: genderPreference,
        payment_option: paymentOption,
        creator_id: editingLinkup.linkup.creator_id, // Include creator_id
        created_at: editingLinkup.linkup.created_at, // Include original creation date
        latitude: editingLinkup.linkup.latitude, // Include location data
        longitude: editingLinkup.linkup.longitude,
        distance: calculateDistance(
          loggedUser.user.latitude,
          loggedUser.user.longitude,
          editingLinkup.linkup.latitude,
          editingLinkup.linkup.longitude
        ),
      };

      try {
        const response = await updateLinkupDB(id, updatedLinkup);
        if (response.success) {
          // Dispatch the update to Redux first
          dispatch(updateLinkupSuccess(response.linkup));

          // Prepare the complete linkup object for the feed
          const feedLinkup = {
            ...response.linkup,
            // Include all fields needed by the feed
            isUserCreated: response.linkup.creator_id === userId,
            createdAtTimestamp: response.linkup.created_at,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              response.linkup.latitude,
              response.linkup.longitude
            ),
            // Include any other fields your LinkupItem component expects
          };

          // Then trigger the update feed with the complete updated linkup
          updateLinkup(feedLinkup);

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
      updateLinkup,
      editingLinkup.linkup, // Add this to dependencies
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
            setSelectedValues={(newGenderPreferences) => {
              setGenderPreference(newGenderPreferences);
              setIsFormModified(true); // Ensure this is set when gender preference changes
            }}
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
            <StyledButton
              type="submit"
              variant="contained"
              colorMode={colorMode}
            >
              Save
            </StyledButton>
            <StyledButton
              variant="contained"
              colorMode={colorMode}
              onClick={handleCancelClick}
              isCancel={true}
            >
              Cancel
            </StyledButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditLinkupForm;
