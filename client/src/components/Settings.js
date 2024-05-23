import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TopNavBar from "./TopNavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(3),
  },
  sections: {
    marginRight: theme.spacing(4),
  },
  sectionItem: {
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  subSectionItem: {
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  },
  activeSectionItem: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  activeSubSectionItem: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    borderLeftWidth: "1px",
    borderLeftColor: "1px solid #D3D3D3",
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const Settings = ({
  colorMode,
  activeSubSection,
  setActiveSubSection,
  onSubSectionClick,
}) => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState("account");
  const theme = useTheme();

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActiveSubSection(null);
  };

  // Determine the borderLeft color based on colorMode
  const borderLeftColor =
    colorMode === "dark" ? "white" : theme.palette.divider;

  return (
    <div>
      <TopNavBar title="Settings" />
      <div className={classes.root}>
        <div className={classes.sections}>
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
          <div
            className={`${classes.sectionItem} ${
              activeSection === "account" && classes.activeSectionItem
            }`}
            onClick={() => handleSectionClick("account")}
          >
            Account
          </div>
          <div
            className={`${classes.sectionItem} ${
              activeSection === "security" && classes.activeSectionItem
            }`}
            onClick={() => handleSectionClick("security")}
          >
            Security
          </div>
          <div
            className={`${classes.sectionItem} ${
              activeSection === "data" && classes.activeSectionItem
            }`}
            onClick={() => handleSectionClick("data")}
          >
            Data
          </div>
        </div>
        <div
          className={classes.content}
          // style={{ borderLeft: `1px solid ${borderLeftColor}` }}
        >
          {activeSection === "account" && (
            <>
              <Typography
                variant="h6"
                onClick={() => onSubSectionClick("accountSettings")}
                className={`${classes.subSectionItem} ${
                  activeSubSection === "accountSettings" &&
                  classes.activeSubSectionItem
                }`}
              >
                Account settings
              </Typography>
              <Typography
                variant="h6"
                onClick={() => onSubSectionClick("deactivateAccount")}
                className={`${classes.subSectionItem} ${
                  activeSubSection === "deactivateAccount" &&
                  classes.activeSubSectionItem
                }`}
              >
                Deactivate account
              </Typography>
            </>
          )}
          {activeSection === "security" && (
            <Typography
              variant="h6"
              onClick={() => onSubSectionClick("securitySettings")}
              className={`${classes.subSectionItem} ${
                activeSubSection === "securitySettings" &&
                classes.activeSubSectionItem
              }`}
            >
              Security settings
            </Typography>
          )}
          {activeSection === "data" && (
            <Typography
              variant="h6"
              onClick={() => onSubSectionClick("dataAndPermissions")}
              className={`${classes.subSectionItem} ${
                activeSubSection === "dataAndPermissions" &&
                classes.activeSubSectionItem
              }`}
            >
              Data and permissions
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
