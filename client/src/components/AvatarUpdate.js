import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Resizer from "react-image-file-resizer";
import { Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const AvatarUpdateContainer = styled("div")({
  position: "relative",
  display: "inline-block",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  [theme.breakpoints.down("md")]: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  border: `2px solid ${theme.palette.background.default}`,
}));

const CameraIconButton = styled(IconButton)(
  ({ theme, isLoggedUserProfile }) => ({
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#fff",
    borderRadius: "50%",
    padding: theme.spacing(1), // Adjust padding to center the icon
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    display: isLoggedUserProfile ? "block" : "none",
    width: theme.spacing(6), // Adjust width and height to create a perfect circle
    height: theme.spacing(6),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })
);

const HiddenInput = styled("input")({
  display: "none",
});

const AvatarUpdate = ({
  currentAvatarUrl,
  isLoggedUserProfile,
  onUpdateAvatar,
}) => {
  const [selectedImage, setSelectedImage] = useState(currentAvatarUrl);
  const inputRef = useRef(null);

  useEffect(() => {
    // Update selectedImage when currentAvatarUrl changes
    setSelectedImage(currentAvatarUrl);
  }, [currentAvatarUrl]);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      Resizer.imageFileResizer(
        imageFile,
        300,
        300,
        "JPEG",
        80,
        0,
        (resizedImage) => {
          setSelectedImage(resizedImage);
          onUpdateAvatar(resizedImage);
        },
        "base64"
      );
    }
  };

  const handleClick = () => {
    if (isLoggedUserProfile) inputRef.current.click();
  };

  return (
    <AvatarUpdateContainer>
      <StyledAvatar
        src={selectedImage}
        alt="Profile Avatar"
        onClick={handleClick}
      />
      {isLoggedUserProfile && (
        <>
          <HiddenInput
            type="file"
            ref={inputRef}
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
          />
          <CameraIconButton
            isLoggedUserProfile={isLoggedUserProfile}
            component="span"
            aria-label="Upload Avatar"
            onClick={handleClick}
            size="large"
          >
            <PhotoCameraIcon fontSize="small" />
          </CameraIconButton>
        </>
      )}
    </AvatarUpdateContainer>
  );
};

export default AvatarUpdate;
