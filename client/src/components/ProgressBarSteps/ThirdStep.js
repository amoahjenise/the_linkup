import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";

const ThirdStep = ({ password, setPassword }) => {
  const dispatch = useDispatch();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);

  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handlePasswordChange = useCallback(
    (e) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      setIsPasswordValid(validatePasswordStrength(newPassword));
      setPasswordMatchError(
        confirmPassword === newPassword ? "" : "The passwords do not match."
      );
    },
    [confirmPassword, setPassword]
  );

  const handleConfirmPasswordChange = useCallback((e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  }, []);

  const validatePasswordStrength = (password) => {
    // Implement your password strength validation logic here
    // For this example, we'll check the following criteria:
    // 1. At least 8 characters long
    // 2. Contains at least one uppercase letter
    // 3. Contains at least one lowercase letter
    // 4. Contains at least one number
    // 5. Contains at least one special character (any character that is not a space or alphanumeric)

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[\S]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  useEffect(() => {
    const isPasswordMatch = password === confirmPassword;
    setIsPasswordValid(validatePasswordStrength(password) && isPasswordMatch);
    setIsPasswordStrong(validatePasswordStrength(password));

    setPasswordMatchError(isPasswordMatch ? "" : "The passwords do not match.");
  }, [password, confirmPassword]);

  useEffect(() => {
    // Dispatch action to update the registration data with the password and isPasswordValid
    dispatch({
      type: "UPDATE_REGISTRATION_DATA",
      payload: {
        password,
        isPasswordValid,
      },
    });
  }, [dispatch, password, isPasswordValid]);

  return (
    <div>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        margin="normal"
        error={!isPasswordStrong}
        helperText={
          !isPasswordStrong
            ? "The password is not strong enough. It should be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters."
            : ""
        }
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        fullWidth
        margin="normal"
        error={passwordMatchError !== ""}
        helperText={passwordMatchError}
      />
    </div>
  );
};

export default ThirdStep;
