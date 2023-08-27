import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";

const useStyles = makeStyles((theme) => ({
  settingsPage: {
    display: "flex",
    flex: 1,
  },
  mainSection: { width: "65%", borderRight: "1px solid #e1e8ed" },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const [activeSubSection, setActiveSubSection] = useState("");

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
  };

  return (
    <div className={classes.settingsPage}>
      <div className={classes.mainSection}>
        <Settings onSubSectionClick={handleSubSectionClick} />
      </div>
      {/* Render the active section content based on activeSection and activeSubsection */}
      {activeSubSection === "deactivateAccount" ? <DeactivateAccount /> : <></>}
    </div>
  );
};

export default SettingsPage;
