import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PostCard from "./PostCard";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

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

const FeedSection = ({ linkUps, onLoadMore, isLoading }) => {
  const classes = useStyles();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    onLoadMore(); // Call the parent component's onLoadMore function
    setIsLoadingMore(false);
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
            {linkUps.length === 0 ? (
              <EmptyFeedPlaceholder />
            ) : (
              linkUps.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          {/* "Load more" button */}
          <Button
            variant="outlined"
            className={classes.loadMoreButton}
            onClick={handleLoadMore}
            disabled={isLoadingMore} // Disable the button while loading
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeedSection;
