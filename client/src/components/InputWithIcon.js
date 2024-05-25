import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  app: {
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  label: {
    display: "flex",
    position: "relative",
    marginBottom: "2rem",
  },
  input: {
    width: "100%",
    borderRadius: "4px",
    padding: "16px",
    paddingRight: "40px",
    fontSize: "16px",
    textOverflow: "ellipsis",
  },
  icon: {
    position: "absolute",
    right: "12px",
    top: "16px",
    width: "24px",
    height: "24px",
  },
}));

const InputWithIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <label htmlFor="copy-button" className={classes.label}>
        <input
          name="copy-button"
          aria-label="copy-button"
          value="123456789"
          className={classes.input}
        />
        <img
          id="icon"
          src="https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/copy-duplicate-multiply-clone-512.png"
          alt="icon"
          className={classes.icon}
        />
      </label>
    </div>
  );
};

export default InputWithIcon;
