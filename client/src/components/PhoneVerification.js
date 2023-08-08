import React, { useState } from "react";
import { Button, TextField, Snackbar } from "@material-ui/core";
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
  snackbar: {
    backgroundColor: "#87CEFA",
    textAlign: "center",
    fontSize: "14px",
    borderRadius: "4px",
    padding: theme.spacing(1, 2),
    minWidth: "200px",
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

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  // State to control snackbar visibility and message
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const customPhoneNumberValidation = (inputNumber, country) => {
    // Regular expression to validate phone number format (allowing only digits and '+' sign)
    const phoneFormatRegex = /^[+\d]+$/;

    // Check if the entered phone number starts with any of the country dial codes or if any of the dial codes starts with the entered phone number.
    const isValidDialCode =
      startsWith(inputNumber, country.dialCode) ||
      startsWith(country.dialCode, inputNumber);

    // Check if the entered phone number satisfies the format regex and has a minimum and maximum length (you can adjust the min and max lengths as needed)
    const isValidFormat =
      phoneFormatRegex.test(inputNumber) &&
      inputNumber.length >= 11 &&
      inputNumber.length <= 15;

    if (isValidDialCode && isValidFormat) {
      setIsValidPhoneNumber(true);
    } else {
      setIsValidPhoneNumber(false);
    }

    return isValidDialCode && isValidFormat;
  };

  const handleVerifyCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleSendVerificationCode = async () => {
    // Uncomment for testing purposes ------------------
    setIsVerificationCodeSent(true);
    // ----

    // try {
    //   // Resend verification code using backend API
    //   await sendVerificationCode(phoneNumber);

    //   setShowSnackbar(true);
    //   setSnackbarMessage("Verification code sent successfully!");
    //   setIsVerificationCodeSent(true);
    //   setVerificationCode("");
    //   setVerificationError(""); // Reset verificationError state
    // } catch (error) {
    //   console.error("Error resending verification code:", error);
    //   alert("Failed to resend verification code. Please try again.");
    // }
  };

  const handleVerifyCode = async () => {
    // Uncomment for Testing purposes -------------------
    dispatch(updatePhoneNumber(phoneNumber));

    // Verification successful, check if user exists
    try {
      const response = await getUserByPhoneNumber(phoneNumber);

      if (action === LOGIN) {
        if (response.data.success) {
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
        if (response.data.success) {
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
    //   const response = await verifyCode(phoneNumber, verificationCode);

    //   if (response.data.success) {
    //     dispatch(updatePhoneNumber(phoneNumber));

    //     // Verification successful, check if user exists
    //     try {
    //       const { user } = await getUserByPhoneNumber(phoneNumber);

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
    //     setVerificationError(response.data.message);
    //   }
    // } catch (error) {
    //   setVerificationError("Failed to verify code. Please try again.", error);
    // }
  };

  return (
    <div className={classes.container}>
      <h2>Phone Verification</h2>
      <PhoneInput
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true,
        }}
        country={"ca"} // Default country code if needed
        value={phoneNumber}
        onChange={(phone) => {
          setPhoneNumber(`+${phone}`);
        }}
        inputClass={classes.input}
        containerClass={classes.input}
        isValid={(inputNumber, country) =>
          customPhoneNumberValidation(inputNumber, country)
        }
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
          {/* Snackbar to display messages */}
          <Snackbar
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowSnackbar(false)}
            message={snackbarMessage}
            ContentProps={{ className: classes.snackbar }}
          />
        </>
      )}
    </div>
  );
}

export default PhoneVerification;
