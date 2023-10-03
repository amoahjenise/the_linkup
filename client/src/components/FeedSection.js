import React from "react";
import { useSelector } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  refreshButton: {
    position: "fixed", // Change to fixed to keep it in place
    bottom: "2%", // Adjust the vertical position as needed
    right: "29%",
    backgroundColor: "rgba(145, 233, 255, 0.9)",
    borderRadius: "50%",
    padding: theme.spacing(4),
    zIndex: 1, // Ensure it's above other content
    transform: "translateY(-50%)", // Center the button vertically
  },
}));

const FeedSection = ({
  linkupList,
  isLoading,
  setShouldFetchLinkups,
  refreshLinkups,
}) => {
  const classes = useStyles();
  const userSentRequests = useSelector((state) => state.userSentRequests);

  return (
    <div className={classes.root}>
      <TopNavBar title="Home" />
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          {linkupList.length === 0 ? (
            <EmptyFeedPlaceholder />
          ) : (
            linkupList.map((linkup) => (
              <LinkupItem
                key={linkup.id}
                linkupItem={linkup}
                setShouldFetchLinkups={setShouldFetchLinkups}
                disableRequest={userSentRequests.includes(linkup.id)}
              />
            ))
          )}
        </div>
      )}
      {/* Floating Refresh Icon */}
      <div className={classes.refreshButton}>
        <Tooltip title="Refresh">
          <IconButton
            onClick={refreshLinkups}
            color="primary"
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default FeedSection;
