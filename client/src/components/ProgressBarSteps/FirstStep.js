import React from "react";
import { styled } from "@mui/material/styles";

// Define styled components
const FormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Align items to the beginning
}));

const Label = styled("label")(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const Input = styled("input")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  boxSizing: "border-box",
}));

const Select = styled("select")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  boxSizing: "border-box",
  appearance: "none",
}));

const FirstStep = ({ userData, setUserData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  return (
    <FormContainer>
      <Label htmlFor="dateOfBirth">Date of Birth</Label>
      <Input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={userData.dateOfBirth}
        onChange={handleChange}
        max={new Date().toISOString().split("T")[0]} // Set max date to today
        required
      />
      <Label htmlFor="gender">Gender</Label>
      <Select
        id="gender"
        name="gender"
        value={userData.gender}
        onChange={handleChange}
        required
      >
        <option value="">--Select--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </Select>
    </FormContainer>
  );
};

export default FirstStep;
