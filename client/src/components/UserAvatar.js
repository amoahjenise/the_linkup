import React from "react";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const LiquidGlassAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: "50%",
  objectFit: "cover",
  cursor: "pointer",
  width: 56,
  height: 56,
  position: "relative",
  zIndex: 1,

  // Simulated "Liquid Glass" glow and depth
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  boxShadow:
    "0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.2)",

  transition: "transform 0.25s ease, box-shadow 0.3s ease",

  "&:hover": {
    transform: "scale(1.06)",
    boxShadow:
      "0 0 0 2px rgba(255, 255, 255, 0.12), 0 6px 16px rgba(0, 0, 0, 0.25)",
  },
}));

const UserAvatar = ({ userData, width = 56, height = 56 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (userData?.id) {
      navigate(`/profile/${userData.id}`);
    }
  };

  return (
    <LiquidGlassAvatar
      alt={userData?.name}
      src={userData?.avatar}
      sx={{ width, height }}
      onClick={handleClick}
    />
  );
};

export default UserAvatar;
