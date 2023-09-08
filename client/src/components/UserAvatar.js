import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const useStyles = makeStyles((theme) => ({
  clickableAvatar: {
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: theme.spacing(1),
    border: "1px solid #e1e8ed",
    cursor: "pointer",
  },
}));

const UserAvatar = ({ userData, width, height }) => {
  const classes = useStyles();
  const navigate = useNavigate(); // Use useNavigate hook

  // Function to handle click on the Avatar
  const handleClick = () => {
    // Check if userData contains the user's profile URL
    if (userData?.id) {
      // Use navigate to redirect to the user's profile URL
      navigate(`/profile/${userData.id}`);
    }
  };

  return (
    <Avatar
      alt={userData?.name}
      src={userData?.avatar}
      className={classes.clickableAvatar}
      style={{ width, height }} // Set width and height as inline styles
      onClick={handleClick}
    />
  );
};

export default UserAvatar;
