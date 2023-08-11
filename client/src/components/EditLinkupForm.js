import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { updateLinkup } from "../redux/actions/linkupActions";
import {
  setEditingLinkup,
  clearEditingLinkup,
} from "../redux/actions/editingLinkupActions";

const useStyles = makeStyles((theme) => ({
  searchInputContainer: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  editLinkUpContainer: {
    flex: "1",
    borderLeft: "0.1px solid lightgrey",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  editContainer: {
    flex: "1",
    color: "black",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 240px)",
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
  editLinkUpInput: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
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

const EditLinkupForm = ({
  linkup,
  setShouldFetchLinkups,
  setIsEditing,
  updateLinkup,
  setEditingLinkup,
  clearEditingLinkup,
}) => {
  const classes = useStyles();
  const [hours, minutes] = linkup.time.split(":");
  const initialDate = new Date(linkup.date);
  initialDate.setHours(hours);
  initialDate.setMinutes(minutes);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [activity, setActivity] = useState(linkup.activity);
  const [location, setLocation] = useState(linkup.location);
  const [genderPreference, setGenderPreference] = useState(
    linkup.gender_preference
  );
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Set the editing linkup when the component mounts
    setEditingLinkup(linkup.id);

    // Clear the editing linkup when the component unmounts
    return () => {
      clearEditingLinkup();
    };
  }, [linkup.id, setEditingLinkup, clearEditingLinkup]);

  const handleUpdateLinkup = async (e) => {
    e.preventDefault();

    try {
      const updatedLinkup = {
        location,
        activity,
        date: selectedDate.toISOString().substring(0, 10),
        time: selectedDate.toISOString().substring(11, 16),
        gender_preference: genderPreference,
      };

      const response = await updateLinkup(linkup.id, updatedLinkup);

      if (response.success) {
        setShouldFetchLinkups(true);
        setSuccessMessage("Your Link Up was edited!");
        clearEditingLinkup(); // Clear editing state
      }

      setSelectedDate(new Date(`${linkup.date}T${linkup.time}`));
      setActivity(linkup.activity);
      setLocation(linkup.location);
      setGenderPreference(linkup.gender_preference);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMessage("");
  };

  return (
    <div className={classes.editLinkUpContainer}>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={successMessage}
      />
      <div className={classes.searchInputContainer}>
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
      </div>
      <div className={classes.editContainer}>
        <h2 className={classes.editLinkUpTitle}>Edit Link Up</h2>
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
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className={classes.editLinkUpInput}
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
          </div>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateLinkup,
  setEditingLinkup,
  clearEditingLinkup,
};

export default connect(null, mapDispatchToProps)(EditLinkupForm);
