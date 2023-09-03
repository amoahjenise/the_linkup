import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Popover, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  moreIcon: {
    cursor: "pointer",
  },
}));

const HorizontalMenu = ({
  onLinkupItemClick,
  onEditClick,
  onDeleteClick,
  onCompleteClick,
  menuAnchor, // Receive menuAnchor as a prop
  setMenuAnchor, // Receive setMenuAnchor as a prop
}) => {
  const classes = useStyles();

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget); // Update the menuAnchor in the parent component
  };

  const handleMenuClose = () => {
    setMenuAnchor(null); // Update the menuAnchor in the parent component
  };

  return (
    <div>
      <MoreHorizIcon onClick={handleMenuClick} className={classes.moreIcon} />
      <Popover
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={onLinkupItemClick}>Go to linkup</MenuItem>
        <MenuItem onClick={onEditClick}>Edit this linkup</MenuItem>
        <MenuItem onClick={onDeleteClick}>Delete this linkup</MenuItem>
        <MenuItem onClick={onCompleteClick}>Mark as completed</MenuItem>
      </Popover>
    </div>
  );
};

export default HorizontalMenu;
