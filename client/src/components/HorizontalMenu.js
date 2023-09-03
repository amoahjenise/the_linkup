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
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
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
        {onLinkupItemClick && (
          <MenuItem onClick={onLinkupItemClick}>Go to linkup</MenuItem>
        )}
        {onEditClick && (
          <MenuItem onClick={onEditClick}>Edit this linkup</MenuItem>
        )}
        {onDeleteClick && (
          <MenuItem onClick={onDeleteClick}>Delete this linkup</MenuItem>
        )}
        {onCompleteClick && (
          <MenuItem onClick={onCompleteClick}>Mark as completed</MenuItem>
        )}
      </Popover>
    </div>
  );
};

export default HorizontalMenu;
