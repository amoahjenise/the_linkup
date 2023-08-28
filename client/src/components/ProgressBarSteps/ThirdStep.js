import React, { useCallback, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

const ThirdStep = ({ password, setPassword, setIsPasswordValid }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

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

  const validatePasswordMatch = useCallback(() => {
    setPasswordErrors((prevErrors) =>
      confirmPassword === password
        ? prevErrors.filter((error) => error !== "Passwords do not match.")
        : [...prevErrors, "Passwords do not match."]
    );
  }, [confirmPassword, password]);

  useEffect(() => {
    validatePasswordStrength(password);
    validatePasswordMatch(); // Call it here
    setIsPasswordValid(
      passwordErrors.length === 0 && password === confirmPassword
    );
  }, [
    password,
    confirmPassword,
    validatePasswordMatch,
    setIsPasswordValid,
    passwordErrors.length,
  ]);

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
