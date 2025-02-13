import React, { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import SearchHintBox from "./SearchHintBox";

const Container = styled("div")(({ theme, colorMode }) => ({
  width: "100%",
  padding: "2px 5px",
  borderRadius: "24px",
  borderWidth: "1px",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
  backgroundColor: colorMode === "dark" ? "rgba(200, 200, 200, 0.1)" : "white",
}));

const InputContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const Input = styled("input")({
  height: "36px",
  width: "100%",
  padding: "0 8px",
  borderRadius: "24px",
  border: "none",
  fontWeight: "semi-bold",
  outline: "none",
});

const IconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  background: "#0097A7",
  borderRadius: "50%",
  cursor: "pointer",
});

const SearchInput = ({ handleInputChange }) => {
  const inputRef = useRef(null);
  const { colorMode } = useColorMode();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const handleClear = () => {
    setSearchValue("");
    handleInputChange({ target: { value: "" } });
    inputRef.current.focus();
  };

  return (
    <div style={{ position: "relative" }}>
      <Container colorMode={colorMode}>
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
          />
          <IconContainer>
            <BiSearch color="#fff" fontSize="18px" />
          </IconContainer>
        </InputContainer>
      </Container>
      {isFocused && <SearchHintBox />}
    </div>
  );
};

export default SearchInput;
