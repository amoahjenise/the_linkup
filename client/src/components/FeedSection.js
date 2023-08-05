import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PostCard from "./PostCard";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";

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
  },
  feedContent: {
    width: "100%",
  },
}));

const FeedSection = ({ linkUps }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <TopNavBar title="Link Space" />
      <div className={classes.feedContainer}>
        {linkUps.length === 0 ? (
          <EmptyFeedPlaceholder />
        ) : (
          <div className={classes.feedContent}>
            {linkUps.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedSection;
