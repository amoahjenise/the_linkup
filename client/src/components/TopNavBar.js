import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  appBar: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    backgroundColor: "#fff",
    borderBottom: "1px solid lightgrey",
  },
  toolbar: {
    display: "flex",
    justifyContent: "center",
  },
  headerText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
}));

const TopNavBar = ({ title, tabs, selectedTab, onChangeTab }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} color="inherit">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.headerText}>
          {title}
        </Typography>
      </Toolbar>{" "}
      {tabs && tabs.length > 0 && (
        <Tabs value={selectedTab} onChange={onChangeTab}>
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      )}
    </AppBar>
  );
};

export default TopNavBar;
