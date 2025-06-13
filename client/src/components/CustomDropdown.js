import React, { useState, useRef, useEffect } from "react";

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

  // Color mode classes
  const isDark = colorMode === "dark";

  // Determine text color for selected value, white if value is set and not empty string
  const selectedTextColor =
    selectedOption && selectedOption.value !== ""
      ? "text-white"
      : isDark
      ? "text-gray-100"
      : "text-gray-800";

  return (
    <div
      ref={dropdownRef}
      className="relative w-full mb-4"
      // dropdown container
    >
      <div
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
        className={`
    flex justify-between items-center
    px-4 py-3
    rounded-xl
    cursor-pointer
    text-sm
    font-sans
    transition-all duration-200
    ${isDark ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80"}
    hover:${isDark ? "border-gray-600" : "border-gray-400"}
    focus:outline-none
    focus-visible:${
      isDark
        ? "border-cyan-500 shadow-[0_0_0_1px_rgba(6,182,212,0.3)]"
        : "border-cyan-700 shadow-[0_0_0_1px_rgba(8,145,178,0.3)]"
    }
  `}
        style={{
          boxShadow:
            colorMode === "dark"
              ? "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.2)"
              : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.05)",
          border: isDark
            ? "1px solid rgba(55, 65, 81, 0.5)"
            : "1px solid rgba(209, 213, 219, 0.5)",
        }}
      >
        {selectedOption ? (
          <span className={selectedTextColor}>{selectedOption.label}</span>
        ) : (
          <span
            style={placeholderStyle}
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {placeholder}
          </span>
        )}
        <svg
          className={`w-5 h-5 transition-transform duration-200 fill-current ${
            isDark ? "text-gray-400" : "text-gray-500"
          } ${isOpen ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.85a.75.75 0 111.08 1.04l-4.25 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </div>

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0
            mt-2
            max-h-36 overflow-y-auto
            rounded-xl
            border
            backdrop-blur-md
            shadow-md
            font-sans text-sm
            z-50
            ${
              isDark
                ? "bg-gray-800 bg-opacity-90 border-gray-700 text-gray-100 shadow-black/30"
                : "bg-white bg-opacity-95 border-gray-300 text-gray-800 shadow-black/10"
            }
            py-2
          `}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <div
                key={option.value}
                tabIndex={0}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(option);
                  }
                }}
                className={`
                  px-4 py-3
                  cursor-pointer
                  transition-colors duration-200
                  flex items-center
                  ${
                    isSelected
                      ? isDark
                        ? "bg-cyan-600 bg-opacity-20"
                        : "bg-cyan-300 bg-opacity-20"
                      : "bg-transparent"
                  }
                  hover:${
                    isDark
                      ? "bg-cyan-600 bg-opacity-20"
                      : "bg-cyan-300 bg-opacity-20"
                  }
                  focus:outline-none focus:bg-cyan-500 focus:bg-opacity-30
                `}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
