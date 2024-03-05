import React from "react";
import { BiSearch } from "react-icons/bi";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid #ccc",
    width: "100%",
    padding: "6px 12px",
    borderRadius: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
      cursor: "pointer",
    },
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    background: "transparent",
    height: "36px",
    width: "100%",
    padding: "0 16px",
    borderRadius: "24px",
    border: "none",
    fontSize: "14px",
    outline: "none",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    background: "#0097A7",
    borderRadius: "50%",
  },
  icon: {
    color: "#fff",
    fontSize: "18px",
  },
}));

const SearchInput = ({ handleInputChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.inputContainer}>
        <input
          type="search"
          name="search"
          placeholder="Search Linkup"
          className={classes.input}
          onChange={handleInputChange}
        />
        <div className={classes.iconContainer}>
          <BiSearch className={classes.icon} />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
