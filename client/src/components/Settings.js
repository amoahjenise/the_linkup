import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  subSectionItem: {
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline", // Add underline on hover
    },
  },
  activeSectionItem: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const Settings = ({ onSubSectionClick }) => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState("account");

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

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
        <div className={classes.content}>
          {activeSection === "account" && (
            <>
              <Typography
                variant="h6"
                onClick={() => onSubSectionClick("accountSettings")}
                className={classes.subSectionItem}
              >
                Account settings
              </Typography>
              <Typography
                variant="h6"
                onClick={() => onSubSectionClick("deactivateAccount")}
                className={classes.subSectionItem}
              >
                Deactivate account
              </Typography>
            </>
          )}
          {activeSection === "security" && (
            <Typography
              variant="h6"
              onClick={() => onSubSectionClick("securitySettings")}
              className={classes.subSectionItem}
            >
              Security settings
            </Typography>
          )}
          {activeSection === "data" && (
            <Typography
              variant="h6"
              onClick={() => onSubSectionClick("dataAndPermissions")}
              className={classes.subSectionItem}
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
