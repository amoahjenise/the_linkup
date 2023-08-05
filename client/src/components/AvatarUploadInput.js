import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRegistrationData } from "../redux/reducers/registrationReducer";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardInput: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(24),
    height: theme.spacing(24),
    border: `2px dashed ${theme.palette.secondary.main}`,
    borderRadius: "50%",
    cursor: "pointer",
    margin: "0 auto",
    marginTop: theme.spacing(4),
  },
  cardInputDragActive: {
    background: theme.palette.secondary.light,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  uploadText: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: 0,
  },
}));

const AvatarUploadInput = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const profilePicture = useSelector(
    (state) => state.registration.registrationData.profilePicture
  );

  const [isImageUploaded, setIsImageUploaded] = useState(!!profilePicture);

  useEffect(() => {
    // Update 'isImageUploaded' state when 'profilePicture' changes
    setIsImageUploaded(!!profilePicture);
  }, [profilePicture]);

  const handleImageChange = (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      if (file) {
        // Read the image file as a data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          // Update the registrationData with the data URL of the selected image
          dispatch(updateRegistrationData({ profilePicture: reader.result }));
          setIsImageUploaded(true);
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageChange,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`${classes.cardInput} ${
          isDragActive ? classes.cardInputDragActive : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className={classes.avatar}>
          {isImageUploaded ? (
            <img src={profilePicture} alt="" className={classes.avatarImage} />
          ) : (
            <span className={classes.uploadText}>
              Upload Profile Picture. Drag and drop an image here
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadInput;
