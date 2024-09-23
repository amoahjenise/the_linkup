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
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { useColorMode } from "@chakra-ui/react";
import { customGenderOptions } from "../utils/customGenderOptions";

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

const ModalInput = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  fontSize: "14px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor:
    colorMode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(130, 131, 129, 0.03)",
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  height: "40px",
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  backgroundColor:
    colorMode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(130, 131, 129, 0.03)",
}));

const CustomDropdown = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: "start",
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
    { key: "male", value: "Man" },
    { key: "female", value: "Woman" },
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
          <CustomDropdown>
            <MultiSelect
              value={genderPreference}
              options={genderOptions}
              onChange={(e) => {
                setGenderPreference(e.value);
                setIsFormModified(true);
              }}
              optionLabel="value"
              maxSelectedLabels={3}
              className={`p-multiselect ${
                formErrors.genderPreference ? "error" : ""
              }`} // Add error class conditionally
              style={{
                width: "100%",
                border: `1px solid ${
                  colorMode === "dark" ? "#4a4a4a" : "#ddd"
                }`,
                backgroundColor:
                  colorMode === "dark"
                    ? "rgba(0, 0, 0, 0.4)"
                    : "rgba(130, 131, 129, 0.03)",
              }}
            />
            {formErrors.genderPreference && (
              <ErrorText>{formErrors.genderPreference}</ErrorText>
            )}
          </CustomDropdown>

          <ModalLabel htmlFor="paymentOption">
            Who's Paying? (Optional)
          </ModalLabel>
          <CustomDropdown>
            <Dropdown
              id="paymentOption"
              aria-label="Who's Paying?"
              value={paymentOption}
              options={[
                { label: "", value: "" },
                { label: "Split The Bill", value: "split" },
                { label: "I Will Pay", value: "iWillPay" },
                { label: "Please Pay", value: "pleasePay" },
              ]}
              onChange={(e) => {
                setPaymentOption(e.value);
                setIsFormModified(true);
              }}
              className="w-full md:w-14rem"
              style={{
                width: "100%",
                border: `1px solid ${
                  colorMode === "dark" ? "#4a4a4a" : "#ddd"
                }`,
                backgroundColor:
                  colorMode === "dark"
                    ? "rgba(0, 0, 0, 0.4)"
                    : "rgba(130, 131, 129, 0.03)",
              }}
            />
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
