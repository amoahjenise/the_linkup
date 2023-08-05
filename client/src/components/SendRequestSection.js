import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SendRequest from "./SendRequest";
import TopNavBar from "./TopNavBar";

const posts = [
  { id: "1", username: "Latifa", activity: "Movies", location: "Cinema Guzzo" },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
    width: "100%",
  },
}));

const SendRequestSection = ({ mockData }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TopNavBar title="Request a Link Up" />
      <div className={classes.messagesContainer}>
        <SendRequest posts={posts} />
      </div>
    </div>
  );
};

export default SendRequestSection;
