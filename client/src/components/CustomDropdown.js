import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";

const DropdownContainer = styled("div")(({ theme, colorMode }) => ({
  position: "relative",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

const DropdownHeader = styled("div")(({ theme, colorMode }) => ({
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2), // Align text within inputs
  border: `1px solid ${colorMode === "dark" ? "#4a4a4a" : "#D3D3D3"}`,
  borderRadius: "8px",
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)"
      : "rgba(130, 131, 129, 0.03)",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const DropdownList = styled("div")(({ theme, colorMode }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  border: `1px solid ${colorMode === "dark" ? "#4a4a4a" : "#D3D3D3"}`,
  borderRadius: "8px",
  backgroundColor: colorMode === "dark" ? "rgb(0, 0, 0)" : "white",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  maxHeight: "200px",
  overflowY: "auto",
}));

const DropdownItem = styled("div")(({ theme, colorMode, selected }) => ({
  padding: theme.spacing(1),
  backgroundColor: selected
    ? colorMode === "dark"
      ? "rgba(0, 123, 255, 0.25)"
      : "rgba(0, 123, 255, 0.1)"
    : "transparent",
  cursor: "pointer",
  "&:hover": {
    backgroundColor:
      colorMode === "dark"
        ? "rgba(0, 123, 255, 0.1)"
        : "rgba(0, 123, 255, 0.05)",
  },
}));

const CustomDropdown = ({
  options = [],
  value = null, // this is the primitive value e.g. "host"
  onChange,
  placeholder = "Select an option",
  placeholderStyle = {},
  colorMode = "dark",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value); // pass only the value
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <DropdownContainer ref={dropdownRef} colorMode={colorMode}>
      <DropdownHeader onClick={() => setIsOpen(!isOpen)} colorMode={colorMode}>
        <span style={selectedOption ? {} : placeholderStyle}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </DropdownHeader>

      {isOpen && (
        <DropdownList colorMode={colorMode}>
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <DropdownItem
                key={option.value}
                onClick={() => handleSelect(option)}
                colorMode={colorMode}
                selected={isSelected}
              >
                {option.label}
              </DropdownItem>
            );
          })}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default CustomDropdown;
