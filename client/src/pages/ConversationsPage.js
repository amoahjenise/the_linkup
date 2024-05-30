import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";
import SendbirdChat from "../components/SendbirdChat";

const useStyles = makeStyles((theme) => ({
  conversationsPage: {
    display: "flex",
    flexDirection: "column", // Adjusted to column direction
    alignItems: "center", // Center items horizontally
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column", // Adjusted to column direction
    width: "100%",
    overflowY: "hidden",
  },
}));

const ConversationsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.conversationsPage}>
      <TopNavBar title="Messages" />
      <div className={classes.container}>
        <SendbirdChat />
      </div>
    </div>
  );
};

export default ConversationsPage;
