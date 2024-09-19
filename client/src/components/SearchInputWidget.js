import React, { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const Container = styled("div")(({ theme, colorMode }) => ({
  width: "100%",
  padding: "4px 12px",
  borderRadius: "24px",
  borderWidth: "1px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
  background: "transparent",
  height: "36px",
  width: "100%",
  padding: "0 16px",
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
});

const Icon = styled(BiSearch)({
  color: "#fff",
  fontSize: "18px",
});

const SearchInput = ({ handleInputChange }) => {
  const inputRef = useRef(null); // Create a reference to the input element
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode

  const handleClick = () => {
    // Programmatically focus on the input element when clicked
    inputRef.current.focus();
  };

  return (
    <Container colorMode={colorMode}>
      <InputContainer onClick={handleClick}>
        <Input
          ref={inputRef} // Attach the ref to the input element
          type="search"
          name="search"
          placeholder="Search Linkups"
          onChange={handleInputChange}
        />
        <IconContainer
          style={{
            background: "#0097A7",
          }}
        >
          <Icon />
        </IconContainer>
      </InputContainer>
    </Container>
  );
};

export default SearchInput;
