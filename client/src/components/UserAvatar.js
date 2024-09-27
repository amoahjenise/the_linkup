import React from "react";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Create a styled component for Avatar with enhanced styles
const ClickableAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "1.25rem",
  border: `2px solid ${theme.palette.common.white}`, // White border
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)", // Slight zoom on hover
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
  },
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
