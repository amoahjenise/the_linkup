import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import LeftMenu from "../components/LeftMenu";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import EditLinkupForm from "../components/EditLinkupForm";
import { fetchLinkups } from "../redux/actions/linkupActions";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    height: "100vh",
  },
  feedSection: {
    flex: "2",
    overflowY: "auto",
    maxWidth: `calc(100% - 2 * ${drawerWidth})`,
    marginLeft: "auto",
    marginRight: "auto",
    borderRight: "1px solid #e1e8ed",
  },
}));

const HomePage = ({ linkupList, isLoading, fetchLinkups }) => {
  const classes = useStyles();
  const feedSectionRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLinkup, setEditingLinkup] = useState(null);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [fetchLinkups, shouldFetchLinkups]);

  useEffect(() => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  }, [linkupList]);

  const handleLoadMore = () => {
    setStartIndex((prevIndex) => prevIndex + 10);
    setShouldFetchLinkups(true); // Trigger fetching when loading more
  };

  return (
    <div className={classes.homePage}>
      <LeftMenu />
      <div className={classes.feedSection} ref={feedSectionRef}>
        <FeedSection
          linkupList={linkupList.slice(0, startIndex + 10)}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          setShouldFetchLinkups={setShouldFetchLinkups}
          setEditingLinkup={setEditingLinkup}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      </div>
      {isEditing ? (
        <EditLinkupForm
          linkup={editingLinkup}
          setShouldFetchLinkups={setShouldFetchLinkups}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      ) : (
        <CreateLinkupForm setShouldFetchLinkups={setShouldFetchLinkups} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkupList: state.linkups.linkupList,
  isLoading: state.linkups.isLoading,
});

const mapDispatchToProps = {
  fetchLinkups,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
