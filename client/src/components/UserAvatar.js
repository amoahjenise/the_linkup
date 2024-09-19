import React from "react";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Create a styled component for Avatar with applied styles
const ClickableAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "1.25rem",
  border: "1px solid #e1e8ed",
  cursor: "pointer",
}));

const UserAvatar = ({ userData, width, height }) => {
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
    <ClickableAvatar
      alt={userData?.name}
      src={userData?.avatar}
      style={{ width, height }} // Set width and height as inline styles
      onClick={handleClick}
    />
  );
};

export default UserAvatar;
