import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLinkup } from "../api/linkUpAPI";
import { updateLinkupList } from "../redux/actions/linkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  widgetContainer: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    borderRadius: "24px",
    borderWidth: "1px",
    border: "0.1px solid #lightgray",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    },
  },
  centerElement: { textAlign: "center" },
  createLinkUpTitle: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1, 4),
  },
  datePicker: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "24px",
    border: "1px solid #ccc", // Add border style
    width: "100%",
  },
  createLinkUpButton: {
    borderRadius: "40px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    backgroundColor: "#0097A7",
    fontWeight: "bold",
    color: "white",
    "&:hover": {
      backgroundColor: "#007b86", // Slightly darker color on hover
    },
    width: "200px",
    height: "60px",
    marginTop: theme.spacing(2),
  },
  inputField: {
    width: "100%",
    fontSize: "14px",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
    backgroundColor: "rgba(130, 131, 129, 0.12)", // Slightly darker color on hover
  },
  inputWithIcon: {
    position: "relative",
    display: "flex",
  },
  infoIcon: {
    width: "0%",
    height: "50%",
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(0.8),
    pointerEvents: "auto", // Allow clicking on the icon
    color: "lightgray",
  },
  // Define styles for the custom dropdown
  customDropdown: {
    fontSize: "14px",
    position: "relative",
    "& select": {
      width: "100%",
      padding: theme.spacing(1),
      backgroundSize: "auto 20px",
      paddingRight: "2.5rem", // Ensure room for the arrow icon
    },
    "& option": {
      backgroundColor: "rgba(64, 64, 64, 2)", // Darker color for the options
      color: "#FFFFFF", // Ensure text is readable
    },
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
    <div className={classes.widgetContainer}>
      <h2 className={classes.createLinkUpTitle}>Create a Link-Up</h2>
      <form className={classes.form} onSubmit={handleCreateLinkUp}>
        <input
          className={classes.inputField}
          type="text"
          placeholder="Activity"
          name="activity"
          required
        />

        <div className={classes.inputWithIcon}>
          <input
            className={classes.inputField}
            type="text"
            placeholder="Location"
            name="location"
            required
          />
          <Tooltip
            title={
              <Typography fontSize={30}>
                The location of your linkup event will be visible to users whose
                requests you have accepted.
              </Typography>
            }
            arrow
            PopperProps={{}}
          >
            <IconButton className={classes.infoIcon}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>

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
          className={`${classes.inputField} ${classes.datePicker}`} // Apply styles
          placeholderText="Select date and time"
          required
        />
        <div className={classes.customDropdown}>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className={classes.inputField}
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
        <div className={classes.customDropdown}>
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
        </div>
        <div className={classes.centerElement}>
          <button type="submit" className={classes.createLinkUpButton}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLinkupWidget;
