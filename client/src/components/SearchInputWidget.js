import React, { useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useColorMode } from "@chakra-ui/react";

// SearchInput.js
const SearchInput = ({ handleInputChange, value }) => {
  const { colorMode } = useColorMode();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    handleInputChange(event); // Let parent handle the value change
  };

  const handleClear = (e) => {
    e.stopPropagation();
    handleInputChange({ target: { value: "" } });
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 flex items-center">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 h-11 px-5 pr-12 outline-none text-base backdrop-blur-md bg-white/10 dark:bg-gray-200/10 text-white placeholder-white/70
  rounded-full border border-white/20`}
        />
        {value ? (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
          >
            <BiX className="text-xl" />
          </button>
        ) : (
          <div className="absolute right-3 text-gray-500">
            <BiSearch className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
