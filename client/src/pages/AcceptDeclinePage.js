import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const useStyles = styled((theme) => ({
  acceptDeclinePage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  requestInfo: {
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
  checkInButton: {
    marginRight: theme.spacing(2),
  },
}));

const AcceptDeclinePage = ({ notifications }) => {
  const classes = useStyles();
  const [isCheckInConfirmed, setCheckInConfirmed] = useState(false);
  const { id } = useParams();
  const notification = notifications.find((n) => n.id.toString() === id);

  const handleCheckIn = () => {
    // Logic to handle the check-in process
    // You can implement an API call or update the necessary data here
    // For now, we'll simply update the state to simulate the confirmation
    setCheckInConfirmed(true);
  };

  return (
    <div className={classes.acceptDeclinePage}>
      <div className={classes.requestInfo}>
        <h2>Link Up Request</h2>
        <p>{notification && notification.notificationText}</p>
      </div>
      {!isCheckInConfirmed ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.checkInButton}
          onClick={handleCheckIn}
        >
          Confirm Check-In
        </Button>
      ) : (
        <p>Check-in confirmed! The world has been notified.</p>
      )}
    </div>
  );
};

export default AcceptDeclinePage;
