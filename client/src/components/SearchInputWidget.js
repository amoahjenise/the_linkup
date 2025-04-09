import React, { useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import SearchHintBox from "./SearchHintBox";

// Container now includes a proper border and adjusts colors based on the color mode.
const Container = styled("div")(({ theme, colorMode }) => ({
  width: "100%",
  padding: "4px 8px",
  borderRadius: "24px",
  border: `1px solid ${
    colorMode === "dark" ? "rgba(255,255,255,0.2)" : "#ccc"
  }`,
  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
}));

// InputContainer is now positioned relative so we can absolutely position the icon.
const InputContainer = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
});

// The Input takes the full available width and adds right padding to prevent text
// from going underneath the icon.
const Input = styled("input")(({ colorMode }) => ({
  flex: 1,
  height: "36px",
  padding: "0 16px",
  paddingRight: "48px", // extra space for the icon
  borderRadius: "24px",
  border: "none",
  fontWeight: 600,
  outline: "none",
  color: colorMode === "dark" ? "#fff" : "#000",
}));

// The IconContainer is absolutely positioned to the right.
// A hover effect is added for better UX.
const IconContainer = styled("div")({
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0097A7",
  borderRadius: "50%",
  padding: "8px",
  cursor: "pointer",
  transition: "background 0.3s ease",
  "&:hover": {
    background: "#007C91",
  },
});

const SearchInput = ({ handleInputChange }) => {
  const inputRef = useRef(null);
  const { colorMode } = useColorMode();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const backgroundColor = colorMode === "dark" ? "rgba(17, 17, 17)" : "#fff";
  const borderColor =
    colorMode === "dark" ? "rgba(255,255,255, 0.025)" : "#ccc";

  const handleClick = () => {
    inputRef.current.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    handleInputChange(event);
  };

  // Clears the input and focuses the field.
  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
    handleInputChange({ target: { value: "" } });
    inputRef.current.focus();
  };

  return (
    <div style={{ position: "relative" }}>
      <Container colorMode={colorMode} style={{ backgroundColor, borderColor }}>
        <InputContainer onClick={handleClick}>
          <Input
            ref={inputRef}
            type="search"
            name="search"
            placeholder="Search Linkups"
            value={searchValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
            colorMode={colorMode}
            style={{ backgroundColor }}
            autoFocus={false}
          />
          <IconContainer onClick={searchValue ? handleClear : handleClick}>
            {searchValue ? (
              <BiX color="#fff" fontSize="18px" />
            ) : (
              <BiSearch color="#fff" fontSize="18px" />
            )}
          </IconContainer>
        </InputContainer>
      </Container>
      {isFocused && <SearchHintBox />}
    </div>
  );
};

export default SearchInput;
