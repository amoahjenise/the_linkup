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
  const isDark = colorMode === "dark";

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
    <div className="relative w-full" ref={dropdownRef}>
      <div
        tabIndex={0}
        className={`
          flex justify-between items-center
          px-4 py-3
          rounded-xl
          cursor-pointer
          text-sm
          transition-all duration-200
          border ${
            isDark
              ? "bg-gray-800/50 border-gray-700/50 text-gray-100 hover:border-gray-600"
              : "bg-white/80 border-gray-300 text-gray-800 hover:border-gray-400"
          }
          ${
            isOpen ? (isDark ? "border-cyan-500/50" : "border-cyan-500/50") : ""
          }
          focus:outline-none
          backdrop-blur-lg
          shadow-sm
          mb-4
        `}
        style={{
          boxShadow: isDark
            ? "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.2)"
            : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
            e.preventDefault();
          }
        }}
      >
        <span
          className={`truncate ${
            selectedOption?.value
              ? isDark
                ? "text-white"
                : "text-gray-900"
              : isDark
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M6 8l4 4 4-4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          className={`
            fixed sm:absolute top-[unset] sm:top-full bottom-4 sm:bottom-[unset]
            left-4 sm:left-0 right-4 sm:right-0
            mt-0 sm:mt-1
            rounded-xl max-h-[60vh] overflow-y-auto 
            border ${
              isDark
                ? "bg-gray-800/90 border-gray-700 text-gray-100 shadow-xl shadow-black/30 backdrop-blur-xl"
                : "bg-white/95 border-gray-300 text-gray-800 shadow-lg shadow-black/10 backdrop-blur-xl"
            }
            z-[1000]
            py-1
            transition-all duration-200
            ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
          style={{
            transformOrigin: "top center",
          }}
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
                    e.preventDefault();
                  }
                }}
                className={`
                  px-4 py-2.5 mx-1 rounded-lg
                  cursor-pointer
                  transition-colors duration-150
                  ${
                    isSelected
                      ? isDark
                        ? "bg-cyan-600/20 text-cyan-400"
                        : "bg-cyan-500/20 text-cyan-600"
                      : ""
                  }
                  ${
                    isDark
                      ? "hover:bg-cyan-600/20 hover:text-cyan-400"
                      : "hover:bg-cyan-500/20 hover:text-cyan-600"
                  }
                `}
              >
                <div className="flex items-center">
                  {isSelected && (
                    <svg
                      className={`w-4 h-4 mr-2 ${
                        isDark ? "text-cyan-400" : "text-cyan-600"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className={`${isSelected ? "ml-6" : "ml-6"}`}>
                    {option.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
