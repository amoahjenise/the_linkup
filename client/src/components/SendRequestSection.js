import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SendRequest from "./SendRequest";
import TopNavBar from "./TopNavBar";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    borderRight: "1px solid #e1e8ed",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
    width: "100%",
  },
}));

const SendRequestSection = ({ linkupId, linkups }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TopNavBar title="Request a Link Up" />
      <div className={classes.messagesContainer}>
        <SendRequest linkups={linkups} linkupId={linkupId} />
      </div>
    </div>
  );
};

export default SendRequestSection;
