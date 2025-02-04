import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { styled } from "@mui/material/styles";

const Section = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(6),
}));

const Container = styled("div")({
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
});

export default function ClerkCustomSignIn() {
  return (
    <Section>
      <Container>
        <SignIn
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl={"/home"}
          forceRedirectUrl={"/home"}
          signUpForceRedirectUrl={"/registration"}
          signUpFallbackRedirectUrl={"/registration"}
        />
      </Container>
    </Section>
  );
}
