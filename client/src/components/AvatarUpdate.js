import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import axios from "axios";

const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

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
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    background: "#fff",
    borderRadius: "50%",
    padding: theme.spacing(0.5),
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  input: {
    display: "none",
  },
}));

const AvatarUpdate = ({ userId, currentAvatar }) => {
  const classes = useStyles();
  const [previewImage, setPreviewImage] = useState(null);
  const inputRef = useRef(null);

  const updateAvatar = (imageUrl) => {
    axios.post(`${userServiceUrl}/api/upload-avatar`, {
      userId: userId,
      imageUrl: imageUrl,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={classes.avatarUpdate}>
      <Avatar
        src={previewImage || currentAvatar}
        alt="Profile Avatar"
        className={classes.avatar}
        onClick={handleClick}
      />
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
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
    </div>
  );
};

export default AvatarUpdate;
