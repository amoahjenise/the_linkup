import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SendRequestSection from "../components/SendRequestSection";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  sendRequestPage: {
    display: "flex",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Set to 100% in mobile mode
    },
  },
}));

const SendRequestPage = () => {
  const classes = useStyles();
  const { linkupId } = useParams(); // Get the postId parameter from the URL
  const linkups = useSelector((state) => state.linkups);
  const { colorMode } = useColorMode();

  return (
    <div className={classes.sendRequestPage}>
      <SendRequestSection
        linkupId={linkupId}
        linkups={linkups.linkupList}
        colorMode={colorMode}
      />
    </div>
  );
};

export default SendRequestPage;
