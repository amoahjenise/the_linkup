import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { styled } from "@mui/material/styles";
import { uploadImages, deleteImages } from "../api/imagesAPI";
import { useSnackbar } from "../contexts/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Resizer from "react-image-file-resizer";

const MAX_IMAGES = 10; // Maximum number of images to display
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const Title = styled("div")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: theme.spacing(2),
}));

const UploadButton = styled("button")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  backgroundColor: "#0097A7",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "#007b86",
  },
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "16px",
}));

const CloseButton = styled("button")(() => ({
  position: "absolute",
  bottom: "95%",
  left: "89%",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "24px",
  fontWeight: "bold",
  color: "black",
  width: "2px",
  height: "2px",
}));

const ImageGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 120px)",
  gridTemplateRows: "repeat(2, 120px)",
  gap: "8px",
}));

const ImageGridItem = styled("div")(() => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
}));

const UploadedImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const AddImageOverlay = styled("label")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  cursor: "pointer",
  color: "white",
}));

const RemoveButton = styled("button")(() => ({
  position: "absolute",
  top: "4px",
  right: "4px",
  backgroundColor: "rgba(100, 100, 100, 0.3)",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "30px",
  height: "30px",
}));

const ImageUploadModal = ({
  userId,
  isOpen,
  onClose,
  profileImages,
  setProfileImages,
  setCurrentImageIndex,
  colorMode,
}) => {
  const { addSnackbar } = useSnackbar();
  const [tempProfileImages, setTempProfileImages] = useState([
    ...profileImages,
  ]);

  const modalTextColor = colorMode === "dark" ? "white" : "black";
  const modalBackgroundColor = colorMode === "dark" ? "#1e1e1e" : "white";

  const resizeImage = (file, outputType) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1080,
        1080,
        outputType,
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleImageSelection = async (e, index) => {
    const file = e.target.files[0];

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      addSnackbar("Invalid file type. Please choose a JPEG or PNG image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      addSnackbar("File size is too large. Please choose a smaller image.");
      return;
    }

    try {
      const resizedImage =
        file.type === "image/jpeg"
          ? await resizeImage(file, "JPEG")
          : await resizeImage(file, "PNG");
      const newProfileImages = [...tempProfileImages];
      newProfileImages[index] = resizedImage;
      setTempProfileImages(newProfileImages);
    } catch (error) {
      addSnackbar("Error resizing image.", error);
    }
  };

  const handleRemove = (index) => {
    const newProfileImages = [...tempProfileImages];
    newProfileImages.splice(index, 1);
    setTempProfileImages(newProfileImages);
  };

  const handleCloseModal = () => {
    setTempProfileImages(profileImages);
    onClose();
  };

  const handleUpload = async () => {
    try {
      await deleteImages(userId);
      const newProfileImages = tempProfileImages.filter(
        (image) => image !== null && image !== undefined
      );

      if (newProfileImages.length > 0) {
        await uploadImages(userId, newProfileImages);
      }

      setProfileImages(newProfileImages);
      setCurrentImageIndex(0);
      onClose();
      addSnackbar("Images uploaded!");
    } catch (error) {
      addSnackbar("Error uploading images", error);
    }
  };

  useEffect(() => {
    setTempProfileImages([...profileImages]);
  }, [profileImages]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={{
        content: {
          color: modalTextColor,
          backgroundColor: modalBackgroundColor,
          position: "absolute",
          top: "55%",
          left: "50%",
          height: "55%",
          width: "50%",
          transform: "translate(-50%, -50%)",
          padding: "2rem",
          outline: "none",
          textAlign: "center",
        },
      }}
    >
      <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
      <Title>Upload Pictures</Title>
      <ImageGrid>
        {Array.from({ length: MAX_IMAGES }).map((_, index) => (
          <ImageGridItem key={index}>
            {tempProfileImages[index] ? (
              <>
                <UploadedImage
                  src={tempProfileImages[index]}
                  alt={`Preview ${index}`}
                />
                <RemoveButton onClick={() => handleRemove(index)}>
                  <DeleteIcon style={{ fontSize: 24, opacity: 0.9 }} />
                </RemoveButton>
              </>
            ) : (
              <AddImageOverlay htmlFor={`file-upload-${index}`}>
                +
                <input
                  type="file"
                  id={`file-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleImageSelection(e, index)}
                  aria-label={`Upload image number ${index + 1}`}
                />
              </AddImageOverlay>
            )}
          </ImageGridItem>
        ))}
      </ImageGrid>
      <UploadButton onClick={handleUpload}>Upload</UploadButton>
    </Modal>
  );
};

export default ImageUploadModal;
