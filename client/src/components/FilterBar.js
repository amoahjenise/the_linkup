import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";

// Styled components using MUI v5's styled API
const FilterMain = styled("div")({
  flex: "1",
  top: 0,
  overflowY: "auto",
  minWidth: 320,
});

const FilterContainer = styled("div")(({ theme }) => ({
  flex: "1",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  top: 0,
  overflowY: "auto",
  borderRadius: "10px", // Rounded corners
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  // minWidth: 200,
  marginBottom: theme.spacing(2), // Added spacing between the two selects
}));

const Title = styled("div")(({ theme }) => ({
  fontSize: "18px", // Adjust the font size for the title
  fontWeight: "bold", // Make the title bold
  marginBottom: theme.spacing(1), // Add spacing below the title
}));

const FilterBar = ({
  activeStatus,
  dateFilter,
  onStatusChange,
  onDateFilterChange,
  activeTab,
}) => {
  const { colorMode } = useColorMode();

  let statusOptions = ["All", "Active", "Closed", "Expired"];

  if (activeTab === 1 || activeTab === 2) {
    // Modify status options for the "Requests Sent" and "Requests Received" tabs
    statusOptions = ["All", "Pending", "Accepted", "Declined", "Expired"];
  }

  const dateOptions = ["All", "Today", "Last 7 days", "Last 30 days"];

  const textColor = colorMode === "dark" ? "white" : "black";

  const labelColor = colorMode === "dark" ? "#00CFFF" : undefined; // Use undefined to keep the default label color

  const underlineStyles = {
    "&:before": {
      borderBottomColor: colorMode === "dark" ? "white" : "gray", // Default line
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: colorMode === "dark" ? "white" : "gray", // On hover
    },
    "&:after": {
      borderBottomColor:
        colorMode === "dark" ? "white" : "theme.palette.primary.main", // After interaction
    },
  };

  return (
    <FilterMain data-testid="sidebarColumn">
      <FilterContainer>
        <Title>Filters</Title>
        <FormControlStyled variant="outlined">
          <InputLabel style={{ color: labelColor }}>Status</InputLabel>
          <Select
            variant="standard"
            value={activeStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            label="Status"
            style={{ color: textColor }}
            sx={underlineStyles} // Apply the underline styles here
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControlStyled>
        <FormControlStyled variant="outlined">
          <InputLabel style={{ color: labelColor }}>Date</InputLabel>
          <Select
            variant="standard"
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            label="Date"
            style={{ color: textColor }}
            sx={underlineStyles} // Apply the underline styles here
          >
            {dateOptions.map((dateOption) => (
              <MenuItem key={dateOption} value={dateOption}>
                {dateOption}
              </MenuItem>
            ))}
          </Select>
        </FormControlStyled>
      </FilterContainer>
    </FilterMain>
  );
};

export default FilterBar;
