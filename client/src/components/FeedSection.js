import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PostCard from "./PostCard";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deleteLinkup } from "../redux/actions/linkupActions";

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
    overflowY: "auto",
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

const FeedSection = ({
  linkupList,
  onLoadMore,
  isLoading,
  setShouldFetchLinkups,
  setEditingLinkup,
  setIsEditing,
  isEditing,
}) => {
  const classes = useStyles();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    onLoadMore(); // Call the parent component's onLoadMore function
    setIsLoadingMore(false);
  };

  const handleDeleteLinkup = (linkupId) => {
    // Call your Redux action to delete the linkup
    deleteLinkup(linkupId);
  };

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
              (console.log("linkupList:", linkupList),
              linkupList?.map((linkup) => (
                <PostCard
                  key={linkup.id}
                  post={linkup}
                  linkupList={linkupList}
                  onDeleteLinkup={handleDeleteLinkup}
                  setShouldFetchLinkups={setShouldFetchLinkups}
                  setEditingLinkup={setEditingLinkup}
                  setIsEditing={setIsEditing}
                  isEditing={isEditing}
                />
              )))
            )}

            {linkupList.length === 0 ? (
              <div />
            ) : (
              <Button
                variant="outlined"
                className={classes.loadMoreButton}
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </Button>
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
