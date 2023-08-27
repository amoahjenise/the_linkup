import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import SendRequestSection from "../components/SendRequestSection";

const useStyles = makeStyles((theme) => ({
  sendRequestPage: {
    display: "flex",
    height: "100vh",
  },
}));

const SendRequestPage = () => {
  const classes = useStyles();
  const { linkupId } = useParams(); // Get the postId parameter from the URL
  const linkups = useSelector((state) => state.linkups);

  return (
    <div className={classes.sendRequestPage}>
      <SendRequestSection linkupId={linkupId} linkups={linkups.linkupList} />
    </div>
  );
};

export default SendRequestPage;
