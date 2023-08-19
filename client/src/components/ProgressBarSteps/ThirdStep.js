import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

const ThirdStep = ({ password, setPassword, isPasswordValid }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    validatePasswordStrength(password);
    validatePasswordMatch(confirmPassword);
  }, [password, confirmPassword]);

  const validatePasswordStrength = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password should be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password should contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password should contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password should contain at least one number.");
    }
    if (!/[^A-Za-z\d\s]/.test(password)) {
      errors.push("Password should contain at least one special character.");
    }
    setPasswordErrors(errors);
  };

  const validatePasswordMatch = (confirmPassword) => {
    setPasswordErrors((prevErrors) =>
      confirmPassword === password
        ? prevErrors.filter((error) => error !== "Passwords do not match.")
        : [...prevErrors, "Passwords do not match."]
    );
  };

  return (
    <div>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        error={passwordErrors.length > 0}
        helperText={passwordErrors.join(" ")}
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        error={passwordErrors.includes("Passwords do not match.")}
        helperText={
          passwordErrors.includes("Passwords do not match.") &&
          "Passwords do not match."
        }
      />
    </div>
  );
};

export default ThirdStep;
