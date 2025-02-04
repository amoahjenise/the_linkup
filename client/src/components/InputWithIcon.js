import React from "react";
import { styled } from "@mui/material/styles";

// Define styled components
const AppWrapper = styled("div")(({ theme }) => ({
  fontFamily: "sans-serif",
  textAlign: "center",
}));

const Label = styled("label")({
  display: "flex",
  position: "relative",
  marginBottom: "2rem",
});

const Input = styled("input")({
  width: "100%",
  borderRadius: "4px",
  padding: "16px",
  paddingRight: "40px",
  fontSize: "16px",
  textOverflow: "ellipsis",
});

const Icon = styled("img")({
  position: "absolute",
  right: "12px",
  top: "16px",
  width: "24px",
  height: "24px",
});

const InputWithIcon = () => {
  return (
    <AppWrapper>
      <Label htmlFor="copy-button">
        <Input name="copy-button" aria-label="copy-button" value="123456789" />
        <Icon
          id="icon"
          src="https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/copy-duplicate-multiply-clone-512.png"
          alt="icon"
        />
      </Label>
    </AppWrapper>
  );
};

export default InputWithIcon;
