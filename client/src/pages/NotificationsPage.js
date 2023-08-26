import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Notifications from "../components/Notifications";
import TopNavBar from "../components/TopNavBar";
import LeftMenu from "../components/LeftMenu";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  notificationsPage: {
    display: "flex",
    height: "100vh",
    flexGrow: 1,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: `calc(100% - 1.5 * ${drawerWidth})`,
    width: "100%",
    height: "100%",
    borderRight: "1px solid #e1e8ed",
  },
  notificationSection: {
    flex: 20,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
}));

const NotificationsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.notificationsPage}>
      <LeftMenu />
      <div className={classes.notificationSection}>
        <div className={classes.container}>
          <TopNavBar title="Notifications" />
          <Notifications />
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default NotificationsPage;
