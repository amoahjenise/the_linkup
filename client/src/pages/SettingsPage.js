import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DeactivateAccount from "../components/DeactivateAccount";
import Settings from "../components/Settings";
import { useColorMode } from "@chakra-ui/react";
import LocationSharingSetting from "../components/LocationSharingSetting";

// Define styled components
const SettingsPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: 1,
}));

const MainSection = styled("div")(({ theme }) => ({
  width: "65%",
  borderRight: "1px solid #D3D3D3",
  [theme.breakpoints.down("md")]: {
    width: "100%", // Set to 100% in mobile mode
  },
}));

const SettingsPage = () => {
  const { colorMode } = useColorMode();
  const [activeSubSection, setActiveSubSection] = useState("accountSettings"); // Lift state up here

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
  };

  return (
    <SettingsPageContainer>
      <MainSection>
        <Settings
          colorMode={colorMode}
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
          onSubSectionClick={handleSubSectionClick}
        />
      </MainSection>
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
    </SettingsPageContainer>
  );
};

export default SettingsPage;
