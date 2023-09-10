import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  settingsPage: {
    display: "flex",
    flex: 1,
  },
  mainSection: {
    width: "65%",
    borderRight: "1px solid #e1e8ed",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Set to 100% in mobile mode
    },
  },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const { colorMode } = useColorMode();
  const [activeSubSection, setActiveSubSection] = useState("accountSettings");

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
  };

  return (
    <div className={classes.settingsPage}>
      <div className={classes.mainSection}>
        <Settings
          colorMode={colorMode}
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
          onSubSectionClick={handleSubSectionClick}
        />
      </div>
      {/* Render the active section content based on activeSection and activeSubsection */}
      {activeSubSection === "deactivateAccount" ? (
        <DeactivateAccount colorMode={colorMode} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SettingsPage;
