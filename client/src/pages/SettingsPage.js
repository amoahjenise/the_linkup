import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";
import { useColorMode } from "@chakra-ui/react";
import UserSettings from "../components/UserSettings"; // Import UserSettings component
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserDataDeletionPage from "./UserDataDeletionPage";
import DataAndPermissionsPage from "./DataAndPermissionsPage";

// Define styled components
const SettingsPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: 1,
  height: "100dvh",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const MainSection = styled("div")(({ theme, colorMode }) => ({
  width: "65%",
  borderRightWidth: "1px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRight: "none",
  },
}));

const RightSection = styled("div")(({ theme, colorMode }) => ({
  width: "35%",
  padding: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  maxHeight: "100dvh", // Ensures it fits the viewport height
  overflowY: "auto", // Enables vertical scrolling
}));

const SlidingSection = styled("div")(({ theme, show, colorMode }) => ({
  position: "fixed",
  top: "64px",
  right: 0,
  width: "100%",
  height: "100%",
  backgroundColor: colorMode === "dark" ? "#1a1a1a" : "#ffffff",
  boxShadow: `-2px 0 5px ${colorMode === "dark" ? "#000000" : "#aaaaaa"}`,
  transform: show ? "translateX(0)" : "translateX(100%)",
  transition: "transform 0.3s ease",
  zIndex: 1000,
  overflowY: "auto",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "20px",
  right: "20px",
  color: theme.palette.text.primary,
  zIndex: 1100,
}));

const SettingsPage = () => {
  const { colorMode } = useColorMode();
  const [activeSubSection, setActiveSubSection] = useState("userSettings");
  const [showSlidingSection, setShowSlidingSection] = useState(false);

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth <= 960) {
      setShowSlidingSection(true); // Show sliding section on mobile when a subsection is clicked
    }
  };

  const closeSlidingSection = () => {
    setShowSlidingSection(false); // Close sliding section
  };

  return (
    <SettingsPageContainer>
      <MainSection colorMode={colorMode}>
        <Settings
          colorMode={colorMode}
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
          onSubSectionClick={handleSubSectionClick}
        />
      </MainSection>

      {/* RightSection is visible on desktop */}
      <RightSection colorMode={colorMode}>
        {activeSubSection === "deactivateAccount" && (
          <DeactivateAccount colorMode={colorMode} />
        )}

        {activeSubSection === "dataDeletionInstructions" && (
          <UserDataDeletionPage />
        )}
        {activeSubSection === "userSettings" && <UserSettings />}
        {activeSubSection === "dataAndPermissions" && (
          <DataAndPermissionsPage />
        )}
      </RightSection>

      {/* SlidingSection is only shown on mobile */}
      <SlidingSection show={showSlidingSection} colorMode={colorMode}>
        <CloseButton onClick={closeSlidingSection}>
          <CloseIcon
            style={{ color: colorMode === "dark" ? "white" : "black" }}
          />
        </CloseButton>
        {activeSubSection === "deactivateAccount" && (
          <DeactivateAccount colorMode={colorMode} />
        )}

        {activeSubSection === "dataAndPermissions" && (
          <DataAndPermissionsPage />
        )}
        {activeSubSection === "dataDeletionInstructions" && (
          <UserDataDeletionPage />
        )}
        {activeSubSection === "userSettings" && <UserSettings />}
      </SlidingSection>
    </SettingsPageContainer>
  );
};

export default SettingsPage;
