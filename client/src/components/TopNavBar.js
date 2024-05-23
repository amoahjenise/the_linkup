import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    borderBottomWidth: "1px",
  },
  headerText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
}));

const TopNavBar = ({ title, tabs, selectedTab, onChangeTab }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const color =
    colorMode === "dark"
      ? "white" // Dark mode text color white
      : "black"; // Light mode text color

  const backgroundColor =
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.99)" // Dark mode background color with 90% transparency
      : "rgba(255, 255, 255, 0.99)"; // Light mode background color

  return (
    <AppBar
      className={classes.appBar}
      elevation={0}
      style={{ color, backgroundColor }}
    >
      <Toolbar>
        <Typography variant="h6" className={classes.headerText}>
          {title}
        </Typography>
      </Toolbar>
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
