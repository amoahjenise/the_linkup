import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Notifications from "../components/Notifications";

const useStyles = makeStyles((theme) => ({
  notificationsPage: {
    display: "flex",
    flexDirection: "column",
    width: "55%",
    borderRightWidth: "1px",
    borderRightColor: "1px solid #D3D3D3",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Set to 100% in mobile mode
    },
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
