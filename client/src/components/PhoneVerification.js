import React, { useState, useEffect, useCallback } from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { updatePhoneNumber } from "../redux/reducers/authReducer";
import startsWith from "lodash.startswith";
import {
  getUserByPhoneNumber,
  sendVerificationCode,
  verifyCode,
} from "../api/authenticationAPI";
import { useSnackbar } from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function PhoneVerification({
  action,
  setNavigateToRegistration,
  setNavigateToUserAuthentication,
}) {
  const classes = useStyles();
  const LOGIN = "LOGIN";
  const SIGNUP = "SIGNUP";

  // Redux state management:
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState({
    countryCode: "ca",
    dialCode: "1",
    format: "+. (...) ...-....",
    name: "Canada",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  // Validate phone number format using useCallback to memoize the function
  const validatePhoneNumberFormat = useCallback(() => {
    const regex = /^[+\d]+$/;
    const numDigits = country.format.split(".").length - 1;

    return (
      startsWith(phoneNumber, country.dialCode) &&
      regex.test(phoneNumber) &&
      phoneNumber.length === numDigits
    );
  }, [country.dialCode, country.format, phoneNumber]);

  const handleVerifyCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleSendVerificationCode = async () => {
    // Uncomment for testing purposes ------------------
    setIsVerificationCodeSent(true);
    addSnackbar("Verification code sent successfully!", {
      timeout: 3000,
    });
    // ----

    // try {
    //   // Send verification code using backend API
    //   await sendVerificationCode(`+${phoneNumber}`);
    //   addSnackbar("Verification code sent successfully!");
    //   setIsVerificationCodeSent(true);
    //   setVerificationCode("");
    //   setVerificationError(""); // Reset verificationError state
    // } catch (error) {
    //   console.error("Error sending verification code:", error);
    //   addSnackbar("Failed to send verification code. Please try again.");
    // }
  };

  const handleVerifyCode = async () => {
    // Uncomment for Testing purposes -------------------
    dispatch(updatePhoneNumber(`+${phoneNumber}`));

    // Verification successful, check if user exists
    try {
      const response = await getUserByPhoneNumber(`+${phoneNumber}`);

      if (action === LOGIN) {
        if (response.success) {
          // User exists, notify parent component (LoginPage.js)
          setNavigateToUserAuthentication(true);
          return;
        } else {
          // User doesn't exists, display error message
          setVerificationError(
            "No user with the provided phone number exists."
          );
          return;
        }
      } else if (action === SIGNUP) {
        if (response.success) {
          // User exists, notify parent component (SignupPage.js)
          setNavigateToUserAuthentication(true);
        } else {
          setNavigateToRegistration(true);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error while fetching user: ", error);
    }
    // --------------------------------------------------

    // // Perform verification code validation logic
    // setVerificationError(""); // Reset verificationError state

    // if (!(verificationCode.length > 0)) {
    //   setVerificationError("Please enter a verification code.");
    //   return;
    // }

    // // Verify the verification code using backend API
    // try {
    //   const response = await verifyCode(`+${phoneNumber}`, verificationCode);

    //   if (response.success) {
    //     dispatch(updatePhoneNumber(`+${phoneNumber}`));

    //     // Verification successful, check if user exists
    //     try {
    //       const { user } = await getUserByPhoneNumber(`+${phoneNumber}`);

    //       if (action === LOGIN) {
    //         if (user) {
    //           // User exists, notify parent component (LoginPage.js)
    //           setNavigateToUserAuthentication(true);
    //           return;
    //         } else {
    //           // User doesn't exist, display error message
    //           setVerificationError(
    //             "No user with the provided phone number exists."
    //           );
    //           return;
    //         }
    //       } else if (action === SIGNUP) {
    //         if (user) {
    //           // User exists, notify parent component (SignupPage.js)
    //           setNavigateToUserAuthentication(true);
    //         } else {
    //           setNavigateToRegistration(true);
    //         }
    //       } else {
    //         return;
    //       }
    //     } catch (error) {
    //       console.error("Error while fetching user:", error);
    //     }
    //   } else {
    //     // Verification failed, display error message
    //     setVerificationError(response.message);
    //   }
    // } catch (error) {
    //   setVerificationError("Failed to verify code. Please try again.", error);
    // }
  };

  const handlePhoneNumberChange = useCallback((phoneNumber, country) => {
    setPhoneNumber(phoneNumber);
    setCountry(country);
  }, []);

  useEffect(() => {
    setIsValidPhoneNumber(validatePhoneNumberFormat(phoneNumber));
  }, [phoneNumber, country, validatePhoneNumberFormat]);

  return (
    <div className={classes.container}>
      <h2>Phone Verification</h2>
      <PhoneInput
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true,
        }}
        country={"ca"} // Default country code set to "Canada"
        // onlyCountries={["ca", "us", "fr"]}
        preferredCountries={["ca", "us", "fr"]}
        enableLongNumbers={true}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        isValid={isValidPhoneNumber}
      />

      {!isVerificationCodeSent ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendVerificationCode}
          className={classes.button}
          disabled={!isValidPhoneNumber}
        >
          Send Verification Code
        </Button>
      ) : (
        <>
          <TextField
            label="Verification Code"
            value={verificationCode}
            onChange={handleVerifyCodeChange}
            variant="outlined"
            fullWidth
            className={classes.input}
          />
          {verificationError && (
            <div style={{ color: "red" }}>{verificationError}</div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyCode}
            className={classes.button}
            disabled={!verificationCode}
          >
            Verify
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSendVerificationCode}
            className={classes.button}
          >
            Resend Code
          </Button>
        </>
      )}
    </div>
  );
}

export default PhoneVerification;
