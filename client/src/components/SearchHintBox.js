import React from "react";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";

// Styled components for the hint box
const HintBoxContainer = styled("div")(({ colorMode }) => ({
  position: "absolute",
  top: "50px",
  width: "100%",
  backgroundColor: colorMode === "dark" ? "#000" : "#fff",
  border: "0 solid black",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: "12px",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  transform: "translateY(0)",
  opacity: 1,
}));

const InnerHintBox = styled("div")(({ colorMode }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  backgroundColor: "rgba(0,0,0,0)",
  minHeight: "0px",
  minWidth: "0px",
  listStyle: "none",
  padding: "0px",
  margin: "0px",
  color: colorMode === "dark" ? "#718296" : "#62686D", // Gray text color
  zIndex: 0,
  flex: 1,
  position: "relative",
}));

const HintTextWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const HintText = styled("span")({
  fontSize: "15px",
  color: "rgb(113, 118, 123)", // Use light gray color for text
  textOverflow: "unset",
});

const SearchHintBox = () => {
  const { colorMode } = useColorMode();

  return (
    <HintBoxContainer colorMode={colorMode}>
      <InnerHintBox colorMode={colorMode}>
        <HintTextWrapper>
          <HintText>
            Try searching for people, activities, or locations.
          </HintText>
        </HintTextWrapper>
      </InnerHintBox>
    </HintBoxContainer>
  );
};

export default SearchHintBox;
