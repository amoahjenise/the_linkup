import React from "react";
import AvatarUploadInput from "../AvatarUploadInput";
import { styled } from "@mui/material/styles";

// Define a styled div for future use or potential styling
const Wrapper = styled("div")(({ theme }) => ({
  // Add styles here if needed
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const SecondStep = ({ userData, setUserData }) => {
  console.log("Second Step userData: ", userData);

  return (
    <Wrapper>
      <AvatarUploadInput userData={userData} setUserData={setUserData} />
    </Wrapper>
  );
};

export default SecondStep;
