import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    height: "100vh",
  },
  mainSection: {
    overflowY: "auto",
    width: "100%",
    maxWidth: `calc(100% - 3 * ${drawerWidth})`,
    marginLeft: "auto",
    marginRight: "auto",
    borderRight: "1px solid #e1e8ed",
  },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const [activeSubSection, setActiveSubSection] = useState("");

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
  };

  return (
    <div className={classes.homePage}>
      <LeftMenu />
      <div className={classes.mainSection}>
        <Settings onSubSectionClick={handleSubSectionClick} />
      </div>
      {/* Render the active section content based on activeSection and activeSubsection */}
      {activeSubSection === "deactivateAccount" ? (
        <DeactivateAccount />
      ) : (
        <div style={{ flex: 1 }} />
      )}
    </div>
  );
};

export default SettingsPage;
