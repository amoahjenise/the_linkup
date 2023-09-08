import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateLinkup } from "../api/linkupAPI";
import { updateLinkupSuccess } from "../redux/actions/linkupActions";
import {
  setEditingLinkup,
  clearEditingLinkup,
} from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  searchInputContainer: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  editLinkUpContainer: {
    flex: "1",
    position: "sticky",
    top: 0,
    overflowY: "auto",
    width: "100%x",
  },
  editContainer: {
    flex: "1",
    color: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  editLinkUpTitle: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: theme.spacing(2),
  },
  editLinkUpForm: {
    display: "flex",
    flexDirection: "column",
  },
  datePicker: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
  },
  editLinkUpInput: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
  },
  cancelLinkupButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  updateLinkupButton: {
    padding: theme.spacing(1),
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  // Define styles for the custom dropdown
  customDropdown: {
    position: "relative",
    marginBottom: theme.spacing(2),
    "& select": {
      width: "100%",
      padding: theme.spacing(1),
      borderRadius: "24px",
      border: "1px solid #ccc",
      marginTop: theme.spacing(1),
      appearance: "none",
      background: "transparent",
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
  const [selectedDate, setSelectedDate] = useState(editingLinkup?.linkup?.date);
  const [activity, setActivity] = useState(editingLinkup?.linkup?.activity);
  const [location, setLocation] = useState(editingLinkup?.linkup?.location);
  const [genderPreference, setGenderPreference] = useState(
    editingLinkup?.linkup?.gender_preference
  );
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

  useEffect(() => {
    // Set the editing linkup when the component mounts
    setEditingLinkup(id);

    // Clear the editing linkup when the component unmounts
    return () => {
      clearEditingLinkup();
    };
  }, [id]);

  const performUpdateLinkup = useCallback(async () => {
    const updatedLinkup = {
      location,
      activity,
      date: selectedDate,
      gender_preference: genderPreference,
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
  }, [
    location,
    activity,
    selectedDate,
    genderPreference,
    id,
    setShouldFetchLinkups,
    dispatch,
    onClose,
    addSnackbar,
  ]);

  const handleUpdateLinkup = useCallback(
    async (e) => {
      e.preventDefault();
      performUpdateLinkup();
    },
    [performUpdateLinkup]
  );

  const handleCancelClick = useCallback(() => {
    dispatch(clearEditingLinkup());
    onClose();
  }, [dispatch, onClose]);

  return (
    <div className={classes.editLinkUpContainer}>
      {/* <div className={classes.searchInputContainer}>
        <TextField
          className={classes.editLinkUpInput}
          placeholder="Search for Link Ups"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div> */}
      <div className={classes.editContainer}>
        <h2 className={classes.editLinkUpTitle}>Edit Link-Up</h2>
        <form className={classes.editLinkUpForm} onSubmit={handleUpdateLinkup}>
          <input
            className={classes.editLinkUpInput}
            type="text"
            placeholder="Activity"
            name="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
          <input
            className={classes.editLinkUpInput}
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <DatePicker
            selected={new Date(selectedDate)}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()} // Set the minimum date to the current date
            minTime={minTime} // Set the minimum time conditionally
            maxTime={maxTime}
            className={classes.datePicker} // Apply the datePicker style
            placeholderText="Select date and time"
            required
          />
          <div className={classes.customDropdown}>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value)}
              aria-label="Gender Preference"
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
          <div className="cta-buttons">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.updateLinkupButton}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={handleCancelClick}
              className={classes.cancelLinkupButton}
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
