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
    padding: theme.spacing(2),
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    borderRadius: "24px",
    border: "1px solid #ccc",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
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
  createLinkUpDatePickerContainer: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  createLinkUpDatePicker: {
    width: "100%",
    padding: theme.spacing(1),
    border: "1px solid #ccc",
    borderRadius: "24px",
    boxSizing: "border-box",
  },
  createLinkUpButton: {
    borderRadius: "40px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    backgroundColor: "#0097A7",
    fontSize: "16px",
    color: "white",
    "&:hover": {
      backgroundColor: "#007b86", // Slightly darker color on hover
    },
    width: "200px",
    height: "60px",
  },
  inputField: {
    width: "100%",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
}));

const CreateLinkupWidget = ({ setShouldFetchLinkups, scrollToTopCallback }) => {
  const classes = useStyles();
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
    <div className={classes.createLinkUpContainer}>
      <div className={classes.createContainer}>
        <h2 className={classes.createLinkUpTitle}>Create a Link-Up</h2>
        <form
          className={classes.createLinkUpWidget}
          onSubmit={handleCreateLinkUp}
        >
          <input
            className={classes.inputField}
            type="text"
            placeholder="Activity"
            name="activity"
            required
          />
          <input
            className={classes.inputField}
            type="text"
            placeholder="Location"
            name="location"
            required
          />
          <div className={classes.createLinkUpDatePickerContainer}>
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
          </div>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className={classes.inputField}
            required
          >
            <option value="">Gender Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </select>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className={classes.inputField}
          >
            <option value="">Payment Option (Optional)</option>
            <option value="split">Split The Bill</option>
            <option value="iWillPay">I Will Pay</option>
            <option value="pleasePay">Please Pay</option>
          </select>
          <button type="submit" className={classes.createLinkUpButton}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLinkupWidget;
