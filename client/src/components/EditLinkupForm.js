import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateLinkup } from "../api/linkupAPI";
import { updateLinkupSuccess } from "../redux/actions/linkupActions";
import { clearEditingLinkup } from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  searchInputContainer: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: "1",
    position: "sticky",
    top: 0,
    width: "100%x",
  },
  modalContainer: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "sticky",
    top: 0,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(3),
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
  },
  datePicker: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
    border: "1px solid #ccc", // Add border style
    width: "100%",
  },
  modalLabel: {
    fontSize: "13px",
    display: "flex",
    justifyContent: "start",
    fontWeight: "bold",
    color: "#6B7280", // Adjust color to your preference
  },
  modalInput: {
    width: "100%",
    fontSize: "14px",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    height: "40px",
  },
  button: {
    width: "140px",
    border: "none",
    borderRadius: "4px",
  },
  // Define styles for the custom dropdown
  customDropdown: {
    fontSize: "14px",
    position: "relative",
    marginBottom: theme.spacing(2),
    "& select": {
      width: "100%",
      padding: theme.spacing(1),
      border: "1px solid #ccc",
      appearance: "none",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 8.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`,
      backgroundPosition: "right 12px center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 20px",
      paddingRight: "2.5rem", // Ensure room for the arrow icon
      "&:focus": {
        outline: "none",
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const EditLinkupForm = ({ onClose, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editingLinkup = useSelector((state) => state.editingLinkup);
  const id = editingLinkup?.linkup?.id;

  // State variables to track form changes
  const [selectedDate, setSelectedDate] = useState(editingLinkup?.linkup?.date);
  const [activity, setActivity] = useState(editingLinkup?.linkup?.activity);
  const [location, setLocation] = useState(editingLinkup?.linkup?.location);
  const [genderPreference, setGenderPreference] = useState(
    editingLinkup?.linkup?.gender_preference
  );
  const [paymentOption, setPaymentOption] = useState(
    editingLinkup?.linkup?.payment_option || ""
  );

  // State variable to track form modification
  const [isFormModified, setIsFormModified] = useState(false);

  const { addSnackbar } = useSnackbar();

  const maxTime = new Date();
  maxTime.setHours(23); // Set hours to 11
  maxTime.setMinutes(45); // Set minutes to 45

  const minTimeDefault = new Date();
  minTimeDefault.setHours(0); // Set hours to 0 (midnight)
  minTimeDefault.setMinutes(0); // Set minutes to 0

  const currentDate = new Date();
  const minTime = selectedDate
    ? new Date(selectedDate).toDateString() === currentDate.toDateString()
      ? currentDate
      : minTimeDefault
    : currentDate;

  // Event handlers to update form state and modification status
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

      // Check if any changes were made in the form
      if (!isFormModified) {
        onClose();
        dispatch(clearEditingLinkup());
        addSnackbar("No changes were made.");
        return; // Don't perform the update
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
    <div className={classes.modalOverlay}>
      <div className={classes.modalContainer}>
        <h2 className={classes.modalTitle}>Edit Link-Up</h2>
        <form className={classes.modalForm} onSubmit={handleUpdateLinkup}>
          <label htmlFor="activity" className={classes.modalLabel}>
            Activity
          </label>
          <input
            className={classes.modalInput}
            type="text"
            placeholder="Activity"
            name="activity"
            id="activity"
            value={activity}
            onChange={handleActivityChange}
            required
          />
          <label htmlFor="location" className={classes.modalLabel}>
            Location
          </label>
          <input
            className={classes.modalInput}
            type="text"
            placeholder="Location"
            name="location"
            id="location"
            value={location}
            onChange={handleLocationChange}
            required
          />
          <label htmlFor="date" className={classes.modalLabel}>
            Date and Time
          </label>
          <DatePicker
            selected={new Date(selectedDate)}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()} // Set the minimum date to the current date
            minTime={minTime} // Set the minimum time conditionally
            maxTime={maxTime}
            className={`${classes.modalInput} ${classes.datePicker}`} // Apply styles
            placeholderText="Select date and time"
            id="date"
            required
          />
          <label htmlFor="genderPreference" className={classes.modalLabel}>
            Gender Preference
          </label>
          <div className={classes.customDropdown}>
            <select
              value={genderPreference}
              onChange={handleGenderPreferenceChange}
              aria-label="Gender Preference"
              id="genderPreference"
              required
            >
              <option value="" disabled>
                Gender Preference
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>

          {/* Payment Option */}
          <label htmlFor="paymentOption" className={classes.modalLabel}>
            Payment Option
          </label>
          <div className={classes.customDropdown}>
            <select
              value={paymentOption}
              onChange={handlePaymentOptionChange}
              aria-label="Payment Option"
              id="paymentOption"
            >
              <option value="">Select Payment Option (Optional)</option>{" "}
              <option value="split">Split The Bill</option>
              <option value="iWillPay">I Will Pay</option>
              <option value="pleasePay">Please Pay</option>
            </select>
          </div>
          <div className={classes.buttonGroup}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              style={{
                marginRight: "10%",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                backgroundColor: "#0097A7",
                color: "white",
                "&:hover": {
                  backgroundColor: "#007b86", // Slightly darker color on hover
                },
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={handleCancelClick}
              className={classes.button}
              style={{
                backgroundColor: "#E0E0E0",
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkupForm;
