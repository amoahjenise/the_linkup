import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";
import { useColorMode } from "@chakra-ui/react";
import LocationSharingSetting from "../components/LocationSharingSetting";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Define styled components
const SettingsPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: 1,
  height: "100vh",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const MainSection = styled("div")(({ theme, colorMode }) => ({
  width: "65%",
  borderRight: `1px solid ${colorMode === "dark" ? "#4a4a4a" : "#D3D3D3"}`,
  transition: "transform 0.3s ease",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRight: "none",
    transform: "translateX(0)",
  },
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
  zIndex: 1000, // Ensure it's above other content
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
  zIndex: 1100, // Ensure the close button is above other content
}));

const SettingsPage = () => {
  const { colorMode } = useColorMode();
  const [activeSubSection, setActiveSubSection] = useState("accountSettings");
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
      <SlidingSection show={showSlidingSection} colorMode={colorMode}>
        <CloseButton onClick={closeSlidingSection}>
          <CloseIcon />
        </CloseButton>
        {/* Render the active section content based on activeSection and activeSubsection */}
        {activeSubSection === "deactivateAccount" && (
          <DeactivateAccount colorMode={colorMode} />
        )}

        {activeSubSection === "locationSharing" && (
          <LocationSharingSetting
            activeSubSection={activeSubSection}
            setActiveSubSection={setActiveSubSection}
          />
        )}
      </SlidingSection>
    </SettingsPageContainer>
  );
};

export default SettingsPage;
