import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";

const DropdownContainer = styled("div")(({ theme, colorMode, hasError }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  borderRadius: "8px",
  border: `1px solid ${
    hasError
      ? theme.palette.error.main
      : colorMode === "dark"
      ? "#4a4a4a"
      : theme.palette.divider
  }`,
  backgroundColor:
    colorMode === "dark"
      ? "rgba(130, 131, 129, 0.1)"
      : "rgba(130, 131, 129, 0.03)",
  transition: "all 0.3s ease",
  boxShadow: hasError
    ? `0 0 0 3px ${theme.palette.error.light}`
    : "0 2px 4px rgba(0, 0, 0, 0.05)",
  position: "relative",
  cursor: "pointer",

  "&:focus-within": {
    borderColor: hasError
      ? theme.palette.error.main
      : theme.palette.primary.main,
    boxShadow: hasError
      ? `0 0 0 3px ${theme.palette.error.light}`
      : `0 0 0 3px ${
          colorMode === "dark"
            ? "rgba(0, 123, 255, 0.25)"
            : "rgba(0, 123, 255, 0.25)"
        }`,
  },

  "&:hover": {
    borderColor: hasError
      ? theme.palette.error.main
      : theme.palette.primary.main,
  },
}));

const DropdownHeader = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2), // Align text within inputs
}));

const DropdownList = styled("ul")(({ theme, colorMode }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: colorMode === "dark" ? "rgba(0,0,0,1)" : "#fff",
  border: `1px solid ${colorMode === "dark" ? "#4a4a4a" : "#D3D3D3"}`,
  borderRadius: "8px",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 10,
  listStyle: "none",
  padding: 0,
  margin: 0,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const DropdownItem = styled("li")(({ theme, colorMode, selected }) => ({
  padding: theme.spacing(1.5),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: colorMode === "dark" ? "#fff" : "#333",
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

const SelectedChips = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  alignItems: "center",
}));

const Chip = styled("div")(({ theme, colorMode }) => ({
  backgroundColor:
    colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  color: colorMode === "dark" ? "#fff" : "#333",
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  borderRadius: "12px",
  fontSize: "0.8rem",
  marginRight: theme.spacing(0.5),
  flexShrink: 0,
}));

const CustomMultiSelect = ({
  colorMode,
  options,
  selectedValues,
  setSelectedValues,
  placeholder = "Select...",
  placeholderStyle,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    if (option.value === "SELECT_ALL") {
      if (selectedValues.length === options.length) {
        setSelectedValues([]); // Deselect all
      } else {
        setSelectedValues(options.map((opt) => opt.value)); // Select all
      }
    } else {
      if (selectedValues.includes(option.value)) {
        setSelectedValues(selectedValues.filter((val) => val !== option.value));
      } else {
        setSelectedValues([...selectedValues, option.value]);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected = selectedValues.length === options.length;

  const renderSelectedText = () => {
    if (selectedValues.length === 0)
      return (
        <span style={{ color: "grey", ...placeholderStyle }}>
          {placeholder}
        </span>
      );

    const selectedLabels = selectedValues.slice(0, 2);
    const remainingCount = selectedValues.length - selectedLabels.length;

    return (
      <>
        {selectedLabels.map((val) => (
          <Chip key={val} colorMode={colorMode}>
            {val}
          </Chip>
        ))}
        {remainingCount > 0 && (
          <Chip colorMode={colorMode}>+{remainingCount} more</Chip>
        )}
      </>
    );
  };

  return (
    <DropdownContainer
      ref={dropdownRef}
      colorMode={colorMode}
      hasError={hasError}
      onClick={toggleDropdown}
      tabIndex={0}
    >
      <DropdownHeader colorMode={colorMode}>
        <SelectedChips>{renderSelectedText()}</SelectedChips>
      </DropdownHeader>

      {isOpen && (
        <DropdownList colorMode={colorMode}>
          <DropdownItem
            colorMode={colorMode}
            selected={isAllSelected}
            onClick={() => handleOptionClick({ value: "SELECT_ALL" })}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </DropdownItem>

          {options.map((option) => (
            <DropdownItem
              key={option.value}
              colorMode={colorMode}
              selected={selectedValues.includes(option.value)}
              onClick={() => handleOptionClick(option)}
            >
              {option.value}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default CustomMultiSelect;
