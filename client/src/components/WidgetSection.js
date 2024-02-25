import React from "react";
import SearchInput from "./SearchInputWidget";
import RefreshFeedWidget from "./RefreshFeedWidget";
import CreateLinkupForm from "./CreateLinkupWidget";
import { makeStyles } from "@material-ui/core/styles";

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
}) => {
  const classes = useStyles();

  return (
    <div className={classes.widgetSection}>
      {/* Search Input Component */}
      <div className={classes.widget}>
        <SearchInput />
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
