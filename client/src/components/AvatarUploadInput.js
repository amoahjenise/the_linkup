import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Resizer from "react-image-file-resizer";

const CardInput = styled("div")(({ theme, isDragActive }) => ({
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
  background: isDragActive ? theme.palette.secondary.light : "transparent",
}));

const Avatar = styled("div")({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  overflow: "hidden",
  position: "relative",
});

const AvatarImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const UploadText = styled("span")({
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  margin: 0,
});

const AvatarUploadInput = ({ userData, setUserData }) => {
  const [isImageUploaded, setIsImageUploaded] = useState(!!userData.avatarURL);

  useEffect(() => {
    // Update 'isImageUploaded' state when 'avatarURL' changes
    setIsImageUploaded(!!userData.avatarURL);
  }, [userData.avatarURL]);

  const handleImageChange = (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      if (file) {
        // Resize the image using ImageFileResizer
        Resizer.imageFileResizer(
          file,
          300,
          300,
          "JPEG",
          80,
          0,
          (resizedImage) => {
            // Update the registration with the data URL of the resized image
            setUserData({ ...userData, avatarURL: resizedImage });
          },
          "base64"
        );
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
      <CardInput {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <Avatar>
          {isImageUploaded ? (
            <AvatarImage src={userData.avatarURL} alt="" />
          ) : (
            <UploadText>
              Upload Profile Picture. Drag and drop an image here
            </UploadText>
          )}
        </Avatar>
      </CardInput>
    </div>
  );
};

export default AvatarUploadInput;
