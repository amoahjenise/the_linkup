import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";
import ToggleColorMode from "./ToggleColorMode";

const CustomAppBar = styled(({ colorMode, ...other }) => <AppBar {...other} />)(
  ({ theme, colorMode }) => ({
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    borderBottomWidth: "1px",
    color: colorMode === "dark" ? "white" : "black",
    backgroundColor:
      colorMode === "dark"
        ? "rgba(0, 0, 0, 0.1)" // Keep the black background with slight transparency
        : "rgba(255, 255, 255, 0.97)", // For light mode, keep a slightly opaque white background
  })
);

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "bold",
}));

const TopNavBar = ({ title, tabs, selectedTab, onChangeTab }) => {
  const { colorMode } = useColorMode();
  const svgRef = useRef(null);

  return (
    <>
      {/* Hidden SVG with the filter definition */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <svg
          ref={svgRef}
          width="0"
          height="0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="displacementFilter">
            <feImage
              href={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='100%' height='100%' fill='%230000' style='filter:blur(5px)' /%3E%3C/svg%3E`}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="thing9"
            />
            <feDisplacementMap
              in2="thing9"
              in="SourceGraphic"
              scale="50"
              xChannelSelector="B"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="2" />
            <feBlend in2="thing9" mode="screen" />
          </filter>
        </svg>
      </div>

      {/* Custom AppBar with Liquid-Glass Effect */}
      <CustomAppBar elevation={0} colorMode={colorMode}>
        <Toolbar
          sx={{
            padding: { xs: "0 16px", sm: "0 24px" },
            justifyContent: "center", // This centers all items in the toolbar
            backdropFilter: "url(#displacementFilter)", // Apply the glass effect filter
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Keep the black background with transparency
          }}
        >
          <HeaderText variant="h6">{title}</HeaderText>
          {/* <ToggleColorMode /> */}
        </Toolbar>
      </CustomAppBar>

      {/* Tabs Section (Optional) */}
      {tabs && tabs.length > 0 && (
        <Tabs value={selectedTab} onChange={onChangeTab}>
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      )}
    </>
  );
};

export default TopNavBar;
