import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLinkup } from "../api/linkupAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  createLinkUpContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  createContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    background: "transparent",
    borderRadius: "24px",
    border: "1px solid #ccc",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
      cursor: "pointer",
    },
    width: "100%",
  },
  createLinkUpTitle: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: theme.spacing(2),
  },
  createLinkUpWidget: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  createLinkUpInput: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px", // Rounded input fields
    border: "1px solid #ccc",
    width: "100%",
  },
  createLinkUpDatePicker: {
    padding: theme.spacing(1),
    border: "1px solid #ccc",
    borderRadius: "24px", // Rounded input fields
  },
  createLinkUpButton: {
    borderRadius: "40px", // Rounded border
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    backgroundColor: "#0097A7",
    fontSize: "16px",
    color: "white",
    "&:hover": {
      backgroundColor: "#1097A7",
    },
    width: "200px",
    height: "60px",
  },
  customDropdown: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: "100%",
    "& select": {
      width: "100%",
      borderRadius: "24px",
      border: "1px solid #ccc",
      appearance: "none",
      padding: theme.spacing(1),
      "&:focus": {
        outline: "none",
        borderColor: "#3498db",
      },
    },
  },
}));

const CreateLinkupWidget = ({ setShouldFetchLinkups, scrollToTopCallback }) => {
  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState();
  const [genderPreference, setGenderPreference] = useState("");
  const { id, name } = loggedUser?.user || {};
  const { addSnackbar } = useSnackbar();

  const maxTime = new Date();
  maxTime.setHours(23); // Set hours to 11
  maxTime.setMinutes(45); // Set minutes to 45

  const minTimeDefault = new Date();
  minTimeDefault.setHours(0); // Set hours to 0 (midnight)
  minTimeDefault.setMinutes(0); // Set minutes to 0

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
      // Call the API to create the link-up
      const response = await createLinkup({
        creator_id: id,
        creator_name: name,
        location: location,
        activity: activity,
        date: selectedDate,
        gender_preference: genderPreference,
      });

      if (response.success) {
        // Update linkupList state with the new linkup
        updateLinkupList(response.newLinkup);
        // socket.emit("linkupCreated", response.newLinkup);
        addSnackbar("Link-up created successfully!");
        // Reset the form inputs
        e.target.reset();
        setSelectedDate(null);
        setGenderPreference("");
        //
        setShouldFetchLinkups(true);
        // Call the callback function - Scroll to top
        scrollToTopCallback();
      } else {
        addSnackbar("An error occurred. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  return (
    <div className={classes.createLinkUpContainer}>
      <div className={classes.createContainer}>
        <h2 className={classes.createLinkUpTitle}>Create a Link-Up</h2>
        <form
          className={classes.createLinkUpWidget}
          onSubmit={handleCreateLinkUp}
        >
          <input
            className={classes.createLinkUpInput}
            type="text"
            placeholder="Activity"
            name="activity"
            required
          />
          <input
            className={classes.createLinkUpInput}
            type="text"
            placeholder="Location"
            name="location"
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
            minDate={new Date()} // Set the minimum date to the current date
            minTime={minTime} // Set the minimum time to the current time
            maxTime={maxTime}
            className={classes.createLinkUpDatePicker}
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
          <div>
            <button type="submit" className={classes.createLinkUpButton}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLinkupWidget;
