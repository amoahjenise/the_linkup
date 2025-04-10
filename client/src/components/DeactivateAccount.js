import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { deactivateUser } from "../api/usersAPI";

// Styled components
const Section = styled("div")(({ theme }) => ({
  flex: "1",
  padding: theme.spacing(2),
  flexDirection: "column",
  justifyContent: "center",
  position: "sticky",
  top: 0,
  overflowY: "auto",
}));

const SectionTitle = styled("h2")(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const SectionContent = styled("p")(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme, textColor }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D3D3D3",
    },
    "&:hover fieldset": {
      borderColor: "#D3D3D3",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#AD1C4F",
    },
  },
  "& .MuiInputLabel-root": {
    color: textColor,
  },
  "& .MuiInputBase-input": {
    color: textColor,
  },
}));

const StyledButton = styled(Button)(({ theme, disabled }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  borderRadius: "10px",
  backgroundColor: "#AD1C4F",
  color: "white",
  "&:hover": {
    backgroundColor: "#B71C1C",
  },
  ...(disabled && {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0.5)",
  }),
}));

const DeactivateAccount = ({ colorMode }) => {
  const [confirmation, setConfirmation] = useState("");
  const confirmationText = "C O N F I R M"; // Display version with spaces
  const isConfirmValid = confirmation === confirmationText.replace(/\s/g, ""); // Validation checks without spaces
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const inputTextColor = colorMode === "dark" ? "white" : "black";

  const handleDeactivate = async () => {
    if (isConfirmValid) {
      try {
        const response = await deactivateUser(loggedUser.user.id);
        if (response.data.success) {
          await signOut();
          dispatch({ type: "LOGOUT" });
          navigate("/");
        }
        addSnackbar(response.data.message);
      } catch (error) {
        addSnackbar(error.message);
      }
    }
  };

  return (
    <Section>
      <SectionTitle>Deactivate Your Account</SectionTitle>
      <SectionContent>
        We're sorry to hear that you want to deactivate your account. Please
        note that your account will be deactivated, not deleted. While your
        account is deactivated: You will no longer appear in searches. Your
        linkups and requests will be hidden from view. However, any previous
        messages you initiated with users will still be visible to those with
        whom you've conversed, although the chat input will be disabled.
      </SectionContent>
      <SectionContent>
        To confirm, type "
        <span
          style={{
            unicodeBidi: "bidi-override",
            letterSpacing: "2px",
            userSelect: "none",
          }}
        >
          {confirmationText}
        </span>
        " below:
        <span style={{ display: "none" }}>
          Confirmation Confirmación Bestätigung
        </span>
      </SectionContent>
      <StyledTextField
        variant="outlined"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        textColor={inputTextColor}
        autoComplete="off"
        placeholder="Type the confirmation word"
      />
      <StyledButton
        variant="contained"
        onClick={handleDeactivate}
        disabled={!isConfirmValid}
      >
        Deactivate Account
      </StyledButton>
    </Section>
  );
};

export default DeactivateAccount;
