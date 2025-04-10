import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Checkbox from "@mui/material/Checkbox";

const DropdownContainer = styled("div")(({ theme, colorMode, hasError }) => ({
  width: "100%",
  marginBottom: theme.spacing(1.5),
  borderRadius: "8px",
  border: `1px solid ${
    hasError
      ? theme.palette.error.main
      : colorMode === "dark"
      ? "#2F3336"
      : "#EFF3F4"
  }`,
  backgroundColor: colorMode === "dark" ? "#202327" : "#F7F9F9",
  transition: "border-color 0.2s, box-shadow 0.2s",
  position: "relative",
  cursor: "pointer",
  "&:focus-within": {
    borderColor: hasError ? theme.palette.error.main : "#0097A7",
    boxShadow: `0 0 0 2px ${
      hasError
        ? theme.palette.error.light
        : colorMode === "dark"
        ? "rgba(0, 151, 167, 0.2)"
        : "rgba(0, 151, 167, 0.1)"
    }`,
  },
  "&:hover": {
    borderColor: hasError
      ? theme.palette.error.main
      : colorMode === "dark"
      ? "#4E5155"
      : "#D6D9DB",
  },
}));

const DropdownHeader = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
}));

const DropdownList = styled("ul")(({ theme, colorMode }) => ({
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 1000,
  listStyle: "none",
  padding: "4px 0",
  margin: 0,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
}));

const DropdownItem = styled("li")(({ theme, colorMode, selected }) => ({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
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

const SelectedChips = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  alignItems: "center",
  gap: "4px",
}));

const Chip = styled("div")(({ theme, colorMode }) => ({
  backgroundColor: colorMode === "dark" ? "#2F3336" : "#EFF3F4",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "0.8125rem",
  flexShrink: 0,
}));

const OptionLabel = styled("span")({
  marginLeft: "8px",
  fontSize: "0.9375rem",
});

const PlaceholderText = styled("span")(({ colorMode }) => ({
  color: colorMode === "dark" ? "#71767B" : "#8B98A5",
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
        setSelectedValues([]);
      } else {
        setSelectedValues(options.map((opt) => opt.value));
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
        <PlaceholderText colorMode={colorMode} style={placeholderStyle}>
          {placeholder}
        </PlaceholderText>
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
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleDropdown();
        }
      }}
    >
      <DropdownHeader colorMode={colorMode} onClick={toggleDropdown}>
        <SelectedChips>{renderSelectedText()}</SelectedChips>
        <KeyboardArrowDownIcon
          style={{
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: colorMode === "dark" ? "#71767B" : "#8B98A5",
            fontSize: "20px",
          }}
        />
      </DropdownHeader>

      {isOpen && (
        <DropdownList colorMode={colorMode}>
          <DropdownItem
            colorMode={colorMode}
            selected={isAllSelected}
            onClick={() => handleOptionClick({ value: "SELECT_ALL" })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleOptionClick({ value: "SELECT_ALL" });
              }
            }}
            tabIndex={0}
          >
            <Checkbox
              checked={isAllSelected}
              indeterminate={selectedValues.length > 0 && !isAllSelected}
              style={{
                color: colorMode === "dark" ? "#0097A7" : "#0097A7",
                padding: "0 8px 0 0",
              }}
            />
            <OptionLabel>
              {isAllSelected ? "Deselect All" : "Select All"}
            </OptionLabel>
          </DropdownItem>

          {options.map((option) => (
            <DropdownItem
              key={option.value}
              colorMode={colorMode}
              selected={selectedValues.includes(option.value)}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleOptionClick(option);
                }
              }}
              tabIndex={0}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                style={{
                  color: colorMode === "dark" ? "#0097A7" : "#0097A7",
                  padding: "0 8px 0 0",
                }}
              />
              <OptionLabel>{option.value}</OptionLabel>
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default CustomMultiSelect;
