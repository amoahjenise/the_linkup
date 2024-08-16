import React, { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { styled } from "@mui/material/styles";

// Styled components
const Container = styled("div")(({ theme }) => ({
  borderWidth: "1px",
  border: "0.1px solid #lightgray",
  width: "100%",
  padding: "6px 12px",
  borderRadius: "24px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
  backgroundColor: "rgba(200, 200, 200, 0.1)",
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
  fontSize: "14px",
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

  const handleClick = () => {
    // Programmatically focus on the input element when clicked
    inputRef.current.focus();
  };

  return (
    <Container>
      <InputContainer onClick={handleClick}>
        <Input
          ref={inputRef} // Attach the ref to the input element
          type="search"
          name="search"
          placeholder="Search Link-Up"
          onChange={handleInputChange}
        />
        <IconContainer>
          <Icon />
        </IconContainer>
      </InputContainer>
    </Container>
  );
};

export default SearchInput;
