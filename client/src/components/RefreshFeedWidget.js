import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/core/styles";
import { useColorMode } from "@chakra-ui/react"; // Import useColorMode here

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "sm",
    borderRadius: "24px",
    borderWidth: "1px",
    border: "0.1px solid #lightgray",
    overflow: "hidden",
    padding: theme.spacing(2),
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    },
    backgroundColor: "rgba(200, 200, 200, 0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  refreshButton: {
    backgroundColor: "#0097A7",
    "&:hover": {
      backgroundColor: "#007b86", // Slightly darker color on hover
    },
  },
}));

const RefreshFeedWidget = ({ onRefreshClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <FontAwesomeIcon icon={faSync} className={classes.icon} />
        <span>Refresh Feed</span>
      </div>
      <div>
        <Tooltip title="Refresh">
          <div className={classes.button}>
            <IconButton
              onClick={onRefreshClick}
              color="primary"
              aria-label="refresh"
              className={classes.refreshButton}
            >
              <RefreshIcon style={{ color: "white" }} />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default RefreshFeedWidget;
