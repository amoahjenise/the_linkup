import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";

const FilterMain = styled("div")(({ theme }) => ({
  flex: "1",
  top: 0,
  overflowY: "auto",
  minWidth: 320,
  padding: theme.spacing(2),
}));

const FilterContainer = styled("div")(({ theme, colorMode }) => ({
  flex: "1",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  top: 0,
  overflowY: "auto",
  borderRadius: "10px",
  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Title = styled("div")(({ theme, colorMode }) => ({
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
}));

const StyledSelect = styled(Select)(({ theme, colorMode }) => ({
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  "&:before": {
    borderBottomColor: colorMode === "dark" ? "#2F3336" : "#EFF3F4",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderBottomColor: colorMode === "dark" ? "#4E5155" : "#D6D9DB",
  },
  "&:after": {
    borderBottomColor: "#0097A7",
  },
  "& .MuiSvgIcon-root": {
    color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme, colorMode }) => ({
  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#1C3D5A" : "#E1F5FE",
  },
  "&.Mui-selected": {
    backgroundColor: colorMode === "dark" ? "#1C3D5A" : "#E1F5FE",
  },
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
    statusOptions = ["All", "Pending", "Accepted", "Declined", "Expired"];
  }

  const dateOptions = ["All", "Today", "Last 7 days", "Last 30 days"];

  return (
    <FilterMain data-testid="sidebarColumn">
      <FilterContainer colorMode={colorMode}>
        <Title colorMode={colorMode}>Filters</Title>
        <FormControlStyled variant="outlined">
          <InputLabel
            sx={{
              color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
              "&.Mui-focused": {
                color: "#0097A7",
              },
            }}
          >
            Status
          </InputLabel>
          <StyledSelect
            colorMode={colorMode}
            variant="standard"
            value={activeStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            label="Status"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
                  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
                },
              },
            }}
          >
            {statusOptions.map((status) => (
              <StyledMenuItem key={status} value={status} colorMode={colorMode}>
                {status}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControlStyled>
        <FormControlStyled variant="outlined">
          <InputLabel
            sx={{
              color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
              "&.Mui-focused": {
                color: "#0097A7",
              },
            }}
          >
            Date
          </InputLabel>
          <StyledSelect
            colorMode={colorMode}
            variant="standard"
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            label="Date"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: colorMode === "dark" ? "#16181C" : "#FFFFFF",
                  color: colorMode === "dark" ? "#E7E9EA" : "#0F1419",
                },
              },
            }}
          >
            {dateOptions.map((dateOption) => (
              <StyledMenuItem
                key={dateOption}
                value={dateOption}
                colorMode={colorMode}
              >
                {dateOption}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControlStyled>
      </FilterContainer>
    </FilterMain>
  );
};

export default FilterBar;
