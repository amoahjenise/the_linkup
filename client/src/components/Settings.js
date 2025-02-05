import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import TopNavBar from "./TopNavBar";

// Styled components
const Root = styled("div")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(3),
}));

const Sections = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const SectionItem = styled("div")(({ theme, active }) => ({
  cursor: "pointer",
  marginBottom: theme.spacing(2),
  color: active ? theme.palette.primary.main : "inherit",
  fontWeight: active ? "bold" : "normal",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SubSectionItem = styled(Typography)(({ theme, active }) => ({
  cursor: "pointer",
  marginBottom: theme.spacing(2),
  color: active ? theme.palette.primary.main : "inherit",
  fontWeight: active ? "bold" : "normal",
  textDecoration: active ? "underline" : "none",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },
}));

const Content = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  borderLeft: "1px solid #D3D3D3",
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Settings = ({
  activeSubSection,
  setActiveSubSection,
  onSubSectionClick,
}) => {
  const [activeSection, setActiveSection] = useState("account");

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActiveSubSection(null);
  };

  return (
    <div>
      <TopNavBar title="Settings" />
      <Root>
        <Sections>
          <Title variant="h6">Settings</Title>
          <SectionItem
            active={activeSection === "account"}
            onClick={() => handleSectionClick("account")}
          >
            Account
          </SectionItem>
          <SectionItem
            active={activeSection === "security"}
            onClick={() => handleSectionClick("security")}
          >
            Security
          </SectionItem>
          <SectionItem
            active={activeSection === "data"}
            onClick={() => handleSectionClick("data")}
          >
            Data
          </SectionItem>
          <SectionItem
            active={activeSection === "location"}
            onClick={() => handleSectionClick("location")}
          >
            Location Sharing
          </SectionItem>
        </Sections>
        <Content>
          {activeSection === "account" && (
            <>
              <SubSectionItem
                variant="h6"
                active={activeSubSection === "accountSettings"}
                onClick={() => onSubSectionClick("accountSettings")}
              >
                Account settings
              </SubSectionItem>
              <SubSectionItem
                variant="h6"
                active={activeSubSection === "deactivateAccount"}
                onClick={() => onSubSectionClick("deactivateAccount")}
              >
                Deactivate account
              </SubSectionItem>
            </>
          )}
          {activeSection === "security" && (
            <SubSectionItem
              variant="h6"
              active={activeSubSection === "securitySettings"}
              onClick={() => onSubSectionClick("securitySettings")}
            >
              Security settings
            </SubSectionItem>
          )}
          {activeSection === "data" && (
            <>
              <SubSectionItem
                variant="h6"
                active={activeSubSection === "dataAndPermissions"}
                onClick={() => onSubSectionClick("dataAndPermissions")}
              >
                Data and permissions
              </SubSectionItem>
              <SubSectionItem
                variant="h6"
                active={activeSubSection === "dataDeletionInstructions"}
                onClick={() => onSubSectionClick("dataDeletionInstructions")}
              >
                Data deletion instructions
              </SubSectionItem>
            </>
          )}
          {activeSection === "location" && (
            <SubSectionItem
              variant="h6"
              active={activeSubSection === "locationSharing"}
              onClick={() => onSubSectionClick("locationSharing")}
            >
              Control location sharing
            </SubSectionItem>
          )}
        </Content>
      </Root>
    </div>
  );
};

export default Settings;
