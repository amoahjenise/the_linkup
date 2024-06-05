import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import SearchInput from "./SearchInputWidget";
import RefreshFeedWidget from "./RefreshFeedWidget";
import CreateLinkupForm from "./CreateLinkupWidget";
import { makeStyles } from "@material-ui/core/styles";
import { searchLinkups } from "../api/linkUpAPI";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import debounce from "lodash/debounce"; // Import debounce function from lodash

const useStyles = makeStyles((theme) => ({
  widgetSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  widget: {
    width: "100%",
    marginBottom: theme.spacing(4), // Spacing between widgets
  },
}));

const WidgetSection = ({
  setShouldFetchLinkups,
  scrollToTopCallback,
  onRefreshClick,
  userId,
  gender,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // Function to handle input change and trigger search with debounce
  const handleInputChange = (event) => {
    setLoading(true);
    // Call debounceSearchLinkups function to prevent multiple API calls
    debounceSearchLinkups(event.target.value);
  };

  // Debounce searchLinkups function to prevent multiple API calls
  const debounceSearchLinkups = useCallback(
    debounce((value) => {
      searchLinkups(value, userId, gender)
        .then((response) => {
          if (response.linkupList.length > 0)
            dispatch(fetchLinkupsSuccess(response.linkupList));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }, 300),
    [searchLinkups, gender, dispatch, setLoading]
  );

  return (
    <div className={classes.widgetSection}>
      {/* Search Input Component */}
      <div className={classes.widget}>
        <SearchInput handleInputChange={handleInputChange} />
      </div>

      {/* Refresh Feed Component */}
      <div className={classes.widget}>
        <RefreshFeedWidget onRefreshClick={onRefreshClick} />
      </div>

      {/* Create Linkup Component */}
      <div className={classes.widget}>
        <CreateLinkupForm
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTopCallback}
        />
      </div>
    </div>
  );
};

export default WidgetSection;
