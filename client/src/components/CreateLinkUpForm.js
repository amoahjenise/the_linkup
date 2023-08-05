import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLinkUp } from "../api/linkUpAPI";

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
    backgroundColor: "#f9f9f9",
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
    backgroundColor: "#f5f8fa",
  },
  createLinkUpButton: {
    padding: theme.spacing(1),
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
}));

const CreateLinkUpForm = ({ updateFeed }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCreateLinkUp = async (e) => {
    e.preventDefault();
    const activity = e.target.activity.value;
    const location = e.target.location.value;
    const date = selectedDate.toISOString();

    // Create the link-up object
    const linkUpData = {
      activity,
      location,
      date,
      status: "Active",
    };

    try {
      // Call the API to create the link-up
      const response = await createLinkUp(linkUpData);

      // Update the feed with the newly created link-up
      updateFeed(response.data);
    } catch (error) {
      console.log(error);
      // Handle error if needed
    }
  };
  return (
    <div className={classes.createLinkUpContainer}>
      <div className={classes.searchInputContainer}>
        <TextField
          className={classes.createLinkUpInput}
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
      <div className={classes.createContainer}>
        <h2 className={classes.createLinkUpTitle}>Create a Link Up</h2>
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
            className={classes.createLinkUpInput}
            placeholderText="Select date and time"
            required
          />
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

export default CreateLinkUpForm;
