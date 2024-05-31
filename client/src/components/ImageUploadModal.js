import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { makeStyles } from "@material-ui/core/styles";
import { uploadImages, deleteImages } from "../api/imagesAPI"; // Adjust the import based on your API functions.
import { useSnackbar } from "../contexts/SnackbarContext";
import DeleteIcon from "@material-ui/icons/Delete";
import Resizer from "react-image-file-resizer";

const MAX_IMAGES = 10; // Maximum number of images to display
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (adjust the value as needed)

const useStyles = makeStyles((theme) => ({
  imageUploadModal: {
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    textAlign: "center",
  },
  title: {
    fontSize: "18px",
    marginBottom: theme.spacing(2),
  },
  uploadButton: {
    // Standard button styles
    width: "100%",
    marginTop: theme.spacing(2),
    backgroundColor: "#0097A7",
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: "#007b86",
    },
    // Stylish props
    borderRadius: "8px", // Adjust as needed
    padding: "10px 20px", // Adjust as needed
    fontSize: "16px", // Adjust as needed
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
    gridTemplateColumns: "repeat(5, 120px)", // Each square is 120px wide
    gridTemplateRows: "repeat(2, 120px)", // Each square is 120px high
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
  setCurrentImageIndex,
  colorMode,
}) => {
  const classes = useStyles();
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
  const modalTextColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "black";

  const modalBackgroundColor =
    colorMode === "dark"
      ? "#1e1e1e" // Dark mode background color with no transparency
      : "white";

  const overlayBackgroundColor =
    colorMode === "dark" ? "rgba(0, 0, 0, 0.5)" : "";

  // // Utility function to convert a File object to a base64 URL
  // const convertFileToBase64URL = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       resolve(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

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
      // Delete existing images under the user ID
      await deleteImages(userId);

      const newProfileImages = tempProfileImages.filter(
        (image) => image !== null && image !== undefined
      );

      if (newProfileImages.length > 0) {
        // Upload newProfileImages to the database
        await uploadImages(userId, newProfileImages);
      }

      // Update the profileImages state with the new state
      setProfileImages(newProfileImages);

      // Set the currentImageIndex to 0
      setCurrentImageIndex(0); // Add this line

      // Close the modal and show a success message
      onClose();
      addSnackbar("Images uploaded!");
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
      className={classes.imageUploadModal}
      style={{
        content: {
          color: modalTextColor,
          backgroundColor: modalBackgroundColor,
        },
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlayBackgroundColor,
        },
      }}
    >
      <button onClick={handleCloseModal} className={classes.closeButton}>
        &times;
      </button>
      <div className={classes.title}>
        <p>Upload Pictures</p>
      </div>
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
                  <DeleteIcon style={{ fontSize: 24, opacity: 0.9 }} />
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
      <button className={classes.uploadButton} onClick={handleUpload}>
        Upload
      </button>
    </Modal>
  );
};

export default ImageUploadModal;
