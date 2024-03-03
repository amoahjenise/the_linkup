import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align items to the beginning
  },
  label: {
    marginBottom: theme.spacing(1),
  },
  input: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    width: "100%",
    boxSizing: "border-box",
    appearance: "none",
  },
}));

const FirstStep = ({ userData, setUserData }) => {
  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  return (
    <div className={classes.form}>
      <label htmlFor="name" className={classes.label}>
        First Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Add your first name"
        value={userData.name}
        onChange={handleChange}
        required
        className={classes.input}
      />

      <label htmlFor="dateOfBirth" className={classes.label}>
        Date of Birth
      </label>
      <input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={userData.dateOfBirth}
        onChange={handleChange}
        max={new Date().toISOString().split("T")[0]} // Set max date to today
        required
        className={classes.input}
      />

      <label htmlFor="gender" className={classes.label}>
        Gender
      </label>
      <select
        id="gender"
        name="gender"
        value={userData.gender}
        onChange={handleChange}
        required
        className={`custom-input ${classes.select}`}
      >
        <option value="">--Select--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  );
};

export default FirstStep;
