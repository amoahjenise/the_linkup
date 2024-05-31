import React from "react";
import Box from "@mui/material/Box";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderBottomWidth: "1px",
    borderBottomColor: "0.1px solid lightgrey",
  },
  iconWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    backgroundColor: "#0097A7", 
    color: "#fff", 
    borderRadius: "50%",
    padding: theme.spacing(1),
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#757575", // Replace with your theme's text secondary color
  },
}));

const ChannelListHeader = () => {
  const classes = useStyles();

  return (
    <Box className={classes.headerContainer}>
      <div className={classes.iconWrapper}>
        <ChatBubbleIcon />
      </div>
      <Box className={classes.textWrapper}>
        <p className={classes.title}>Discover New Link-ups</p>
        <p className={classes.subtitle}>
          Check the feed to link up with people!
        </p>
      </Box>
    </Box>
  );
};

export default ChannelListHeader;
