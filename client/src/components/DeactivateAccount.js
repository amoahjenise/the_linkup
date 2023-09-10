import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { deleteUser } from "../api/usersAPI";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  section: {
    flex: "1",
    padding: theme.spacing(2),
    flexDirection: "column",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  sectionContent: {
    fontSize: "1rem",
    marginBottom: theme.spacing(2),
  },
  input: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(1.5, 4),
    fontSize: "1rem",
    borderRadius: "10px",
    backgroundColor: "#AD1C4F",
    color: "white",
    "&:hover": {
      backgroundColor: "#B71C1C",
    },
  },
}));

const DeactivateAccount = ({ colorMode }) => {
  const [confirmation, setConfirmation] = useState("");
  const isConfirmValid = confirmation === "CONFIRM";
  const classes = useStyles({ isConfirmValid });
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputTextColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "black";

  const handleDeactivate = async () => {
    if (isConfirmValid) {
      try {
        const response = await deleteUser(loggedUser.user.id);
        if (response.data.success) {
          dispatch({ type: "LOGOUT" }); // Dispatch the action to trigger state reset
          navigate("/"); // Redirect to landing page
        }
        addSnackbar(response.data.message);
      } catch (error) {
        addSnackbar(error.message);
      }
    }
  };

  return (
    <div className={classes.section}>
      <h2 className={classes.sectionTitle}>Deactivate Your Account</h2>
      <p className={classes.sectionContent}>
        We are sorry to see you leave. Are you sure you want to deactivate your
        account? This action cannot be undone.
      </p>
      <p className={classes.sectionContent}>
        To confirm, type "CONFIRM" below:
      </p>
      <TextField
        className={classes.input}
        variant="outlined"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        InputProps={{ style: { color: inputTextColor } }}
        InputLabelProps={{ style: { color: inputTextColor } }}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleDeactivate}
        disabled={!isConfirmValid}
      >
        Deactivate Account
      </Button>
    </div>
  );
};

export default DeactivateAccount;
