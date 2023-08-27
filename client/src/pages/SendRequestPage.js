import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SendRequestSection from "../components/SendRequestSection";

const useStyles = makeStyles((theme) => ({
  sendRequestPage: {
    display: "flex",
    width: "50%",
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
