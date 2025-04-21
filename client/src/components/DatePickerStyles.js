// Remove this line from your component:
// import "../DatePicker.css";

// Create a new file called DatePickerStyles.js and add:
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";

export const StyledDatePicker = styled(DatePicker)(({ theme, colorMode }) => ({
  width: "100%",
  padding: "12px 16px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: colorMode === "dark" ? "#202327" : "#F7F9F9",
  border: `1px solid ${colorMode === "dark" ? "#2F3336" : "#EFF3F4"}`,
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  "&:focus": {
    borderColor: "#0097A7",
    boxShadow: `0 0 0 2px ${
      colorMode === "dark" ? "rgba(0, 151, 167, 0.2)" : "rgba(0, 151, 167, 0.1)"
    }`,
  },
  marginBottom: theme.spacing(1.5),
  "&:hover": {
    borderColor: colorMode === "dark" ? "#4E5155" : "#D6D9DB",
  },
  cursor: "pointer",
  
  // Target the actual date picker popup
  "& .react-datepicker": {
    fontFamily: "inherit",
    backgroundColor: colorMode === "dark" ? "#1E1E1E" : "#FFFFFF",
    border: `1px solid ${colorMode === "dark" ? "#2D2D2D" : "#E5E7EB"}`,
    borderRadius: "8px",
    boxShadow: theme.shadows[4],
    
    "&__header": {
      backgroundColor: colorMode === "dark" ? "#0097A7" : "#007B86",
      borderBottom: "none",
    },
    
    "&__day": {
      color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
      "&:hover": {
        backgroundColor: colorMode === "dark" ? "#333333" : "#F0F0F0",
      },
      "&--selected": {
        backgroundColor: "#0097A7",
        color: "#FFFFFF",
      },
    },
    
    // Add more specific selectors as needed
  }
}));