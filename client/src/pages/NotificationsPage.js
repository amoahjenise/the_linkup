import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Notifications from "../components/Notifications";

const useStyles = makeStyles((theme) => ({
  notificationsPage: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "50%",
    borderRight: "1px solid #e1e8ed",
  },
  notificationSection: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
}));

const NotificationsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.notificationsPage}>
      <div className={classes.notificationSection}>
        <Notifications />
      </div>
    </div>
  );
};

export default NotificationsPage;
