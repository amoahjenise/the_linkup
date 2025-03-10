import React from "react";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import LogoHeader from "../components/LogoHeader";
import RegistrationProcess from "../components/RegistrationProcess";

// Define styled component for the container
const Container = styled("div")(({ theme }) => ({
  flex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  marginLeft: "auto",
  marginRight: "auto",
  minHeight: "100dvh", // Set the minimum height of the container to cover the entire viewport height
  padding: theme.spacing(2),
}));

const SignupPage = () => {
  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <div>
            <LogoHeader />
            <RegistrationProcess />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
