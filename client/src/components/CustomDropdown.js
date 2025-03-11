import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";

const DropdownContainer = styled("div")(({ theme, colorMode }) => ({
  position: "relative",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

const DropdownHeader = styled("div")(({ theme, colorMode }) => ({
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
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
  transition: "border-color 0.2s ease-in-out",
  "&:hover": {
    borderColor: colorMode === "dark" ? "#6a6a6a" : "#aaa",
  },
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

const ArrowIcon = styled("svg")(({ isOpen, colorMode }) => ({
  width: "20px",
  height: "20px",
  fill: colorMode === "dark" ? "#ffffff" : "#333333",
  transition: "transform 0.3s ease",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
}));

const CustomDropdown = ({
  options = [],
  value = null,
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
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <DropdownContainer ref={dropdownRef} colorMode={colorMode}>
      <DropdownHeader onClick={() => setIsOpen(!isOpen)} colorMode={colorMode}>
        <span style={selectedOption ? {} : placeholderStyle}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ArrowIcon isOpen={isOpen} colorMode={colorMode} viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.85a.75.75 0 111.08 1.04l-4.25 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </ArrowIcon>
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
