import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  filterMain: {
    flex: "1",
    borderLeft: "0.1px solid lightgrey",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  filterContainer: {
    flex: "1",
    color: "black",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  editLinkUpTitle: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: theme.spacing(2),
  },
}));

const FilterBar = ({ activeStatus, onStatusChange }) => {
  const classes = useStyles();
  const statusOptions = ["All", "Active", "Expired"];

  return (
    <div className={classes.filterMain}>
      <div className={classes.filterContainer}>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={activeStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            label="Status"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterBar;
