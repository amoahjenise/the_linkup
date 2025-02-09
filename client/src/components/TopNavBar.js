import React from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";
import ToggleColorMode from "./ToggleColorMode";

const CustomAppBar = styled(AppBar)(({ theme, colorMode }) => ({
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  borderBottom:
    colorMode === "dark"
      ? `1px solid white`
      : `1px solid ${theme.palette.divider}`,
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor:
    colorMode === "dark" ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.97)",
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "bold",
}));

const TopNavBar = ({ title, tabs, selectedTab, onChangeTab }) => {
  const { colorMode } = useColorMode();

  return (
    <CustomAppBar elevation={0} colorMode={colorMode}>
      <Toolbar>
        <HeaderText variant="h6">{title}</HeaderText>
        <ToggleColorMode />
      </Toolbar>
      {tabs && tabs.length > 0 && (
        <Tabs value={selectedTab} onChange={onChangeTab}>
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      )}
    </CustomAppBar>
  );
};

export default TopNavBar;
