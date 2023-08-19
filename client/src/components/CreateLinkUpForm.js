import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { createLinkup } from "../api/linkupAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  searchInputContainer: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  createLinkUpContainer: {
    flex: "1",
    borderLeft: "0.1px solid lightgrey",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  createContainer: {
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
  createLinkUpTitle: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: theme.spacing(2),
  },
  createLinkUpForm: {
    display: "flex",
    flexDirection: "column",
  },
  createLinkUpInput: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
  },
  createLinkUpButton: {
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

const CreateLinkupForm = ({
  socket,
  updateLinkupList,
  scrollToTopCallback,
}) => {
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

      if (socket && response.success) {
        // Update linkupList state with the new linkup
        updateLinkupList(response.newLinkup);
        // Emit the "createLinkup" event with the created linkup data
        socket.emit("createLinkup", response.newLinkup);
        addSnackbar("Link-up created successfully!");
        // Reset the form inputs
        e.target.reset();
        setSelectedDate(null);
        setGenderPreference("");
        // Call the callback function - Scroll to top
        scrollToTopCallback();
      } else {
        addSnackbar("An error occured. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  return (
    <div className={classes.createLinkUpContainer}>
      <div className={classes.searchInputContainer}>
        <TextField
          className={classes.createLinkUpInput}
          placeholder="Search for Link-Ups"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.createContainer}>
        <h2 className={classes.createLinkUpTitle}>Create a Link-Up</h2>
        <form
          className={classes.createLinkUpForm}
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
            className={classes.createLinkUpInput}
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
              className={classes.createLinkUpButton}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.loggedUser,
  };
};

const mapDispatchToProps = {
  updateLinkupList,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLinkupForm);
