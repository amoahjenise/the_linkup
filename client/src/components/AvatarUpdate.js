import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Resizer from "react-image-file-resizer";
import { updateUserAvatar } from "../api/usersAPI";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  avatarUpdate: {
    position: "relative",
    display: "inline-block",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    border: `2px solid ${theme.palette.background.default}`,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#fff",
    borderRadius: "50%",
    padding: theme.spacing(0.5),
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    display: ({ isLoggedUserProfile }) =>
      isLoggedUserProfile ? "block" : "none",
  },
  input: {
    display: "none",
  },
}));

const AvatarUpdate = ({ userId, currentAvatarUrl, isLoggedUserProfile }) => {
  const classes = useStyles({ isLoggedUserProfile });
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
          handleUpload(resizedImage);
        },
        "base64"
      );
    }
  };

  const handleClick = () => {
    if (isLoggedUserProfile) inputRef.current.click();
  };

  const handleUpload = async (resizedImage) => {
    if (selectedImage) {
      await updateUserAvatar(userId, resizedImage);
    }
  };

  return (
    <div className={classes.avatarUpdate}>
      <Avatar
        src={selectedImage}
        alt="Profile Avatar"
        className={classes.avatar}
        onClick={handleClick}
      />
      {isLoggedUserProfile && (
        <>
          <input
            type="file"
            ref={inputRef}
            accept="image/jpeg, image/png"
            className={classes.input}
            onChange={handleImageChange}
          />
          <IconButton
            className={classes.cameraIcon}
            component="span"
            aria-label="Upload Avatar"
            onClick={handleClick}
          >
            <PhotoCameraIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default AvatarUpdate;
