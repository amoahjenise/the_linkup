import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";

const DropdownContainer = styled("div")(({ theme, colorMode }) => ({
  position: "relative",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

const DropdownHeader = styled("div")(({ theme, colorMode }) => ({
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: colorMode === "dark" ? "#202327" : "#F7F9F9",
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    borderColor: colorMode === "dark" ? "#4E5155" : "#D6D9DB",
  },
  "&:focus-within": {
    borderColor: "#0097A7",
    boxShadow: `0 0 0 2px ${
      colorMode === "dark" ? "rgba(0, 151, 167, 0.2)" : "rgba(0, 151, 167, 0.1)"
    }`,
  },
}));

const DropdownList = styled("div")(({ theme, colorMode }) => ({
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 1000,
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  maxHeight: "200px",
  overflowY: "auto",
  padding: "4px 0",
}));

const DropdownItem = styled("div")(({ theme, colorMode, selected }) => ({
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: selected
    ? colorMode === "dark"
      ? "#1C3D5A"
      : "#E1F5FE"
    : "transparent",
  cursor: "pointer",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#1C3D5A" : "#E1F5FE",
  },
}));

const ArrowIcon = styled("svg")(({ isOpen, colorMode }) => ({
  width: "20px",
  height: "20px",
  fill: colorMode === "dark" ? "#71767B" : "#8B98A5",
  transition: "transform 0.2s ease",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
}));

const PlaceholderText = styled("span")(({ colorMode }) => ({
  color: colorMode === "dark" ? "#71767B" : "#8B98A5",
}));

const CustomDropdown = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select an option",
  placeholderStyle,
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
      <DropdownHeader
        onClick={() => setIsOpen(!isOpen)}
        colorMode={colorMode}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedOption ? (
          <span>{selectedOption.label}</span>
        ) : (
          <PlaceholderText colorMode={colorMode} style={placeholderStyle}>
            {placeholder}
          </PlaceholderText>
        )}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(option);
                  }
                }}
                tabIndex={0}
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
