import React, { useState, useRef, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Checkbox from "@mui/material/Checkbox";

const sharedFontFamily = `"SF Pro Display", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif`;

const CustomMultiSelect = ({
  colorMode,
  options,
  selectedValues,
  setSelectedValues,
  placeholder = "Select...",
  placeholderStyle,
  hasError = false,
  isMobile,
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
        <span
          className={`truncate ${
            colorMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
          style={placeholderStyle}
        >
          {placeholder}
        </span>
      );

    const selectedLabels = selectedValues.slice(0, 2);
    const remainingCount = selectedValues.length - selectedLabels.length;

    return (
      <>
        {selectedLabels.map((val) => (
          <div
            key={val}
            className={`bg-opacity-50 rounded-full px-2 py-1 text-xs truncate ${
              colorMode === "dark"
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-300 text-gray-800"
            }`}
            style={{ maxWidth: isMobile ? 80 : 100 }}
          >
            {val}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={`bg-opacity-50 rounded-full px-2 py-1 text-xs ${
              colorMode === "dark"
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-300 text-gray-800"
            }`}
            style={{ maxWidth: isMobile ? 80 : 100 }}
          >
            +{remainingCount} more
          </div>
        )}
      </>
    );
  };

  // Use styles from dropdown unfocused state
  const isDark = colorMode === "dark";

  const containerStyle = {
    boxShadow: isDark
      ? "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.2)"
      : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.05)",
    border: isDark
      ? "1px solid rgba(55, 65, 81, 0.5)"
      : "1px solid rgba(209, 213, 219, 0.5)",
    fontFamily: sharedFontFamily,
  };

  const containerClasses = `w-full mb-3 rounded-xl cursor-pointer relative transition-all duration-200 outline-none focus:outline-none
    flex justify-between items-center px-4 py-3 min-h-[20px] text-sm
    ${
      isDark
        ? "text-gray-100 bg-gray-800 bg-opacity-50"
        : "text-gray-800 bg-white bg-opacity-80"
    }
    hover:${isDark ? "border-gray-600" : "border-gray-400"}
    `;

  return (
    <div
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleDropdown();
        }
      }}
      className={containerClasses}
      onClick={(e) => {
        // Only toggle if not clicking inside the dropdown menu
        if (!isOpen) {
          toggleDropdown();
        }
      }}
      style={containerStyle}
    >
      <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
        {renderSelectedText()}
      </div>
      <KeyboardArrowDownIcon
        style={{
          transition: "transform 0.2s ease",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          color: isDark ? "#9CA3AF" : "#6B7280",
          fontSize: 20,
        }}
      />

      {isOpen && (
        <ul
          className={`absolute top-full left-0 right-0 mt-2 rounded-xl max-h-52 overflow-y-auto border backdrop-blur-md z-50 text-sm
            ${
              isDark
                ? "bg-gray-800 bg-opacity-90 border-gray-700 text-gray-100 shadow-black/30"
                : "bg-white bg-opacity-95 border-gray-300 text-gray-800 shadow-black/10"
            }`}
          style={{ fontFamily: sharedFontFamily }}
        >
          <li
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleOptionClick({ value: "SELECT_ALL" });
              }
            }}
            onClick={() => handleOptionClick({ value: "SELECT_ALL" })}
            className={`flex items-center px-4 py-3 cursor-pointer select-none ${
              isAllSelected
                ? isDark
                  ? "bg-cyan-600 bg-opacity-20"
                  : "bg-cyan-300 bg-opacity-20"
                : ""
            } hover:${
              isDark ? "bg-cyan-600 bg-opacity-20" : "bg-cyan-300 bg-opacity-20"
            }`}
          >
            <Checkbox
              checked={isAllSelected}
              indeterminate={selectedValues.length > 0 && !isAllSelected}
              style={{
                color: isDark ? "#06B6D4" : "#0891B2",
                padding: 0,
                marginRight: 8,
              }}
              size="small"
            />
            <span className="truncate flex-1 select-none">
              {isAllSelected ? "Deselect All" : "Select All"}
            </span>
          </li>

          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <li
                key={option.value}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleOptionClick(option);
                  }
                }}
                onClick={() => handleOptionClick(option)}
                className={`flex items-center px-4 py-3 cursor-pointer select-none ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-600 bg-opacity-20"
                      : "bg-cyan-300 bg-opacity-20"
                    : ""
                } hover:${
                  isDark
                    ? "bg-cyan-600 bg-opacity-20"
                    : "bg-cyan-300 bg-opacity-20"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  style={{
                    color: isDark ? "#06B6D4" : "#0891B2",
                    padding: 0,
                    marginRight: 8,
                  }}
                  size="small"
                />
                <span className="truncate flex-1">{option.value}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomMultiSelect;
