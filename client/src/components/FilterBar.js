import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  filterMain: {
    flex: "1",
    borderLeft: "1px solid lightgrey",
    top: 0,
    overflowY: "auto",
  },
  filterContainer: {
    flex: "1",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    top: 0,
    overflowY: "auto",
    width: "350px",
    borderRadius: "10px", // Rounded corners
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2), // Added spacing between the two selects
  },
  title: {
    fontSize: "18px", // Adjust the font size for the title
    fontWeight: "bold", // Make the title bold
    marginBottom: theme.spacing(1), // Add spacing below the title
  },
}));

const FilterBar = ({
  activeStatus,
  dateFilter,
  onStatusChange,
  onDateFilterChange,
  activeTab,
}) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  let statusOptions = ["All", "Active", "Closed", "Completed", "Expired"];

  if (activeTab === 1 || activeTab === 2) {
    // Modify status options for the "Requests Sent" and "Requests Received" tabs
    statusOptions = ["All", "Pending", "Accepted", "Declined", "Expired"];
  }

  const dateOptions = ["All", "Today", "Last 7 days", "Last 30 days"];

  const textColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "black";

  const labelColor = colorMode === "dark" ? "#00CFFF" : undefined; // Use undefined to keep the default label color

  return (
    <div className={classes.filterMain} data-testid="sidebarColumn">
      <div className={classes.filterContainer}>
        <div className={classes.title}>Filters</div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel style={{ color: labelColor }}>Status</InputLabel>
          <Select
            value={activeStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            label="Status"
            style={{ color: textColor }}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel style={{ color: labelColor }}>Date</InputLabel>
          <Select
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            label="Date"
            style={{ color: textColor }}
          >
            {dateOptions.map((dateOption) => (
              <MenuItem key={dateOption} value={dateOption}>
                {dateOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterBar;
