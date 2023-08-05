import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import SendRequestSection from "../components/SendRequestSection";

const useStyles = makeStyles((theme) => ({
  sendRequestPage: {
    display: "flex",
    height: "100vh",
  },
}));

const SendRequestPage = ({ posts }) => {
  const classes = useStyles();

  return (
    <div className={classes.sendRequestPage}>
      <LeftMenu />
      <SendRequestSection />
    </div>
  );
};

export default SendRequestPage;
