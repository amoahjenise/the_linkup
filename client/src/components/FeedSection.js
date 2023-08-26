import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deleteLinkup } from "../api/linkupAPI";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  feedContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(2),
  },
  feedContent: {
    width: "100%",
  },
  loadMoreButton: {
    marginTop: theme.spacing(2),
  },
}));

const FeedSection = ({ linkupList, isLoading, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const userSentRequests = useSelector((state) => state.userSentRequests);

  return (
    <div className={classes.mainContainer}>
      <TopNavBar title="Home" />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.feedContainer}>
          <div className={classes.feedContent}>
            {linkupList.length === 0 ? (
              <EmptyFeedPlaceholder />
            ) : (
              linkupList?.map((linkup) => (
                <LinkupItem
                  key={linkup.id}
                  linkupItem={linkup}
                  setShouldFetchLinkups={setShouldFetchLinkups}
                  disableRequest={userSentRequests.includes(linkup.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkupList: state.linkups.linkupList,
  isLoading: state.linkups.isLoading,
});

const mapDispatchToProps = {
  deleteLinkup,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedSection);
