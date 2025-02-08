import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { styled } from "@mui/material/styles";

const RootContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function ClerkCustomSignUp() {
  return (
    <RootContainer>
      <SignUp afterSignInUrl={"/home"} afterSignUpUrl={"/registration"} />
    </RootContainer>
  );
}
