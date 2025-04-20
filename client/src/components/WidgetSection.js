import React from "react";
import CreateLinkupForm from "./CreateLinkupWidget";
import { styled } from "@mui/material/styles";
import CategoryWidget from "./CategoryWidget";

const WidgetSectionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
}));

const Widget = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2), // Spacing between widgets
  minWidth: "300px",
}));

const WidgetSection = ({
  toggleWidget,
  isMobile,
  refreshFeed,
  handleScrollToTop
}) => {

  const handleFilterChange = (selectedCategories) => {
    console.log("Selected Categories:", selectedCategories);
    // Apply filter logic to the feed based on selectedCategories
  };

  return (
    <WidgetSectionContainer>
      {/* Create Linkup Component */}
      <Widget>
        <CreateLinkupForm
          toggleWidget={toggleWidget}
          isMobile={isMobile}
          refreshFeed={refreshFeed}
          handleScrollToTop={handleScrollToTop}
        />
      </Widget>

      {/* <Widget>
        <CategoryWidget onFilterChange={handleFilterChange} />
      </Widget> */}
    </WidgetSectionContainer>
  );
};

export default WidgetSection;
