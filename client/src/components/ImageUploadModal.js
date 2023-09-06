import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { makeStyles } from "@material-ui/core/styles";
import { uploadImages, deleteImages } from "../api/imagesAPI"; // Adjust the import based on your API functions.
import { useSnackbar } from "../contexts/SnackbarContext";

const MAX_IMAGES = 9; // Maximum number of images to display
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (adjust the value as needed)

const useStyles = makeStyles((theme) => ({
  imageUploadModal: {
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    textAlign: "center",
  },
  closeButton: {
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
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 120px)", // Each square is 120px wide
    gridTemplateRows: "repeat(3, 120px)", // Each square is 120px high
    gap: "8px",
  },
  imageGridItem: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  addImageOverlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    cursor: "pointer",
    color: "white",
  },
  removeButton: {
    position: "absolute",
    top: "4px",
    right: "4px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  emptyGridItem: {
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
  },
}));

const ImageUploadModal = ({
  userId,
  isOpen,
  onClose,
  profileImages,
  setProfileImages,
}) => {
  const classes = useStyles();
  const { addSnackbar } = useSnackbar();
  // Create a separate state to hold changes temporarily
  const [tempProfileImages, setTempProfileImages] = useState([
    ...profileImages,
  ]);

  useEffect(() => {
    // Update the tempProfileImages state whenever profileImages changes
    setTempProfileImages([...profileImages]);
  }, [profileImages]);

  // Utility function to convert a File object to a base64 URL
  const convertFileToBase64URL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

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

    // Convert the selected file to a base64 URL
    const base64URL = await convertFileToBase64URL(file);

    // Update profileImages state with the new image
    const newProfileImages = [...tempProfileImages];
    newProfileImages[index] = base64URL;
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
      // Delete existing images under the user ID
      await deleteImages(userId);

      const newProfileImages = tempProfileImages.filter(
        (image) => image !== null
      );

      if (newProfileImages.length > 0) {
        // Upload newProfileImages to the database
        await uploadImages(userId, newProfileImages);
      }

      // Update the profileImages state with the new state
      setProfileImages(newProfileImages);

      // Close the modal and show a success message
      onClose();
      addSnackbar("Images uploaded!");
    } catch (error) {
      addSnackbar("Error uploading images", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className={classes.imageUploadModal}
    >
      <button onClick={handleCloseModal} className={classes.closeButton}>
        &times;
      </button>
      <h2>Upload Pictures</h2>

      <div className={classes.imageGrid}>
        {Array.from({ length: MAX_IMAGES }).map((_, index) => (
          <div key={index} className={classes.imageGridItem}>
            {tempProfileImages[index] && (
              <>
                <img
                  src={tempProfileImages[index]}
                  alt={`Preview ${index}`}
                  className={classes.uploadedImage}
                />
                <button
                  onClick={() => handleRemove(index)}
                  className={classes.removeButton}
                >
                  Remove
                </button>
              </>
            )}
            {!tempProfileImages[index] && (
              // Use handleImageSelection for empty grid items
              <label
                htmlFor={`file-upload-${index}`}
                className={classes.addImageOverlay}
              >
                +
                <input
                  type="file"
                  id={`file-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleImageSelection(e, index)}
                  aria-label={`Upload image number ${index + 1}`}
                />
              </label>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleUpload}>Upload</button>
    </Modal>
  );
};

export default ImageUploadModal;
