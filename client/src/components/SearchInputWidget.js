import React, { useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useColorMode } from "@chakra-ui/react";
import SearchHintBox from "./SearchHintBox";

const SearchInput = ({ handleInputChange, loading, value }) => {
  const inputRef = useRef(null);
  const { colorMode } = useColorMode();
  const [searchValue, setSearchValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    inputRef.current.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    handleInputChange(event);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
    handleInputChange({ target: { value: "" } });
    inputRef.current.focus();
  };

  return (
    <div className="relative w-full px-2">
      <div className="relative flex items-center" onClick={handleClick}>
        <input
          ref={inputRef}
          type="search"
          name="search"
          placeholder="Search Linkups"
          value={searchValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          autoFocus={false}
          className={`flex-1 h-10 px-3 pr-8 rounded-full w-full outline-none text-sm ${
            colorMode === "dark"
              ? "bg-gray-800 text-white placeholder-gray-400"
              : "bg-gray-100 text-black placeholder-gray-500"
          }`}
        />
        <div
          className={`absolute right-1 top-1/3 transform -translate-y-1/2 flex items-center justify-center rounded-full p-1 cursor-pointer transition-colors ${
            searchValue
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={searchValue ? handleClear : handleClick}
        >
          {searchValue ? (
            <BiX className="text-lg" />
          ) : (
            <BiSearch className="text-lg" />
          )}
        </div>
      </div>
      {isFocused && <SearchHintBox />}
    </div>
  );
};

export default SearchInput;
