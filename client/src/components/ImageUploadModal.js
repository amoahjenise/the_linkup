import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { styled } from "@mui/material/styles";
import { uploadImages, deleteImages } from "../api/imagesAPI"; // Adjust the import based on your API functions.
import { useSnackbar } from "../contexts/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Resizer from "react-image-file-resizer";

const MAX_IMAGES = 10; // Maximum number of images to display
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (adjust the value as needed)

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
  borderRadius: "8px", // Adjust as needed
  padding: "10px 20px", // Adjust as needed
  fontSize: "16px", // Adjust as needed
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
  gridTemplateColumns: "repeat(5, 120px)", // Each square is 120px wide
  gridTemplateRows: "repeat(2, 120px)", // Each square is 120px high
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
  backgroundColor: "rgba(100, 100, 100, 0.3)", // Light gray with 90% transparency
  border: "none",
  borderRadius: "50%", // Makes it round
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "30px", // Adjust as needed
  height: "30px", // Adjust as needed
}));

const EmptyGridItem = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: "1px solid #e1e8ed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
  height: "100%",
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

  // Utility function to resize images
  const resizeImage = (file, outputType) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1080, // Desired width
        1080, // Desired height
        outputType, // Output type (JPEG or PNG)
        90, // Quality
        0, // Rotation
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  // Create a separate state to hold changes temporarily
  const [tempProfileImages, setTempProfileImages] = useState([
    ...profileImages,
  ]);

  // Define text and background color based on color mode
  const modalTextColor = colorMode === "dark" ? "white" : "black";

  const modalBackgroundColor = colorMode === "dark" ? "#1e1e1e" : "white";

  const overlayBackgroundColor =
    colorMode === "dark" ? "rgba(0, 0, 0, 0.5)" : "";

  const handleImageSelection = async (e, index) => {
    const file = e.target.files[0];

    // Validate file type and size here
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      addSnackbar("Invalid file type. Please choose a JPEG or PNG image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      addSnackbar("File size is too large. Please choose a smaller image.");
      return;
    }

    // Resize the selected image to JPEG or PNG format based on its type
    let resizedImage;
    if (file.type === "image/jpeg") {
      resizedImage = await resizeImage(file, "JPEG");
    } else if (file.type === "image/png") {
      resizedImage = await resizeImage(file, "PNG");
    }

    // Update profileImages state with the new image URI
    const newProfileImages = [...tempProfileImages];
    newProfileImages[index] = resizedImage;
    setTempProfileImages(newProfileImages);
  };

  const handleRemove = (index) => {
    // Remove the image from the tempProfileImages state
    const newProfileImages = [...tempProfileImages];
    newProfileImages.splice(index, 1);
    setTempProfileImages(newProfileImages);
  };

  const handleCloseModal = () => {
    // Clear selected files when closing the modal
    setTempProfileImages(profileImages);
    onClose();
  };

  const handleUpload = async () => {
    try {
      // Validate and remove existing images
      await deleteImages(userId);

      // Prepare form data for uploading
      const formData = new FormData();
      tempProfileImages.forEach((image, index) => {
        if (image) {
          formData.append(`image${index}`, image); // Append each image file
        }
      });

      // Upload the images
      await uploadImages(userId, formData);

      // Update the state with the uploaded images
      setProfileImages(tempProfileImages.filter((img) => img));
      setCurrentImageIndex(0); // Reset current image index

      // Close modal and show success message
      onClose();
      addSnackbar("Images uploaded successfully!");
    } catch (error) {
      addSnackbar("Error uploading images", error);
    }
  };

  useEffect(() => {
    // Update the tempProfileImages state whenever profileImages changes
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
          width: "40%",
          transform: "translate(-50%, -50%)",
          padding: "2rem",
          outline: "none",
          textAlign: "center",
        },
      }}
    >
      <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
      <Title>
        <p>Upload Pictures</p>
      </Title>
      <ImageGrid>
        {Array.from({ length: MAX_IMAGES }).map((_, index) => (
          <ImageGridItem key={index}>
            {tempProfileImages[index] && (
              <>
                <UploadedImage
                  src={tempProfileImages[index]}
                  alt={`Preview ${index}`}
                />
                <RemoveButton onClick={() => handleRemove(index)}>
                  <DeleteIcon style={{ fontSize: 24, opacity: 0.9 }} />
                </RemoveButton>
              </>
            )}
            {!tempProfileImages[index] && (
              // Use handleImageSelection for empty grid items
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
