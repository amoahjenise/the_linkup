import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useColorMode } from "@chakra-ui/react";
import { Dialog } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardsContainer: {
    display: "grid",
    gap: theme.spacing(4),
    maxWidth: "1200px",
    margin: "auto",
    padding: theme.spacing(3),
    justifyContent: "center",
  },
  card: {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
    borderWidth: "1px",
    borderColor: "1px solid #D3D3D3",
  },
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.3s ease",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
    outline: "none",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    maxWidth: "80vw", // Adjust maximum width as needed
    maxHeight: "80vh", // Adjust maximum height as needed
    overflow: "auto",
  },

  modalImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain", // Ensure the image fits inside the Dialog
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    cursor: "pointer",
  },
}));

const ImageGrid = ({ images, currentImageIndex, setCurrentImageIndex }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode(); // Access color mode from Chakra UI
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickImage = (index) => {
    if (images[index]) {
      setCurrentImageIndex(index);
      handleOpenModal();
    }
  };

  const isExtraSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );

  let imagesPerLine = 5;
  if (isExtraSmall) {
    imagesPerLine = 2;
  } else if (isSmall) {
    imagesPerLine = 2;
  }

  const totalImages = images.length;
  const numberOfBlanks = 10 - (totalImages % 10);
  const filledImages = [...images, ...Array(numberOfBlanks).fill(null)];

  // Define background gradient based on color mode
  const blankSquareGradient =
    colorMode === "dark"
      ? "linear-gradient(135deg, rgba(34, 34, 34, 0.6) 0%, rgba(34, 34, 34, 0.4) 50%)"
      : "linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.8) 50%)";

  return (
    <div className={classes.container}>
      <div
        className={classes.cardsContainer}
        style={{
          gridTemplateColumns: `repeat(${imagesPerLine}, 160px)`,
        }}
      >
        {filledImages.map((image, index) => (
          <div
            key={index}
            className={`${classes.card} ${image ? "" : classes.blankSquare}`}
            style={{
              background: image ? "" : blankSquareGradient,
            }}
            onClick={() => handleClickImage(index)}
          >
            {image && (
              <img
                src={image}
                alt={`${index + 1}`}
                className={classes.cardImage}
              />
            )}
          </div>
        ))}
      </div>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <div className="dialog">
          <CloseIcon className={classes.closeIcon} onClick={handleCloseModal} />
          <img
            src={images[currentImageIndex]}
            alt={`${currentImageIndex + 1}`}
            className={classes.modalImage}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ImageGrid;
