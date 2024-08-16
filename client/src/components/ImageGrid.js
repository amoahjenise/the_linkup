import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useColorMode } from "@chakra-ui/react";
import { Dialog } from "@mui/material";

// Styled components
const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const CardsContainer = styled("div")(({ theme, imagesPerLine }) => ({
  display: "grid",
  gap: theme.spacing(4),
  maxWidth: "1200px",
  margin: "auto",
  padding: theme.spacing(3),
  justifyContent: "center",
  gridTemplateColumns: `repeat(${imagesPerLine}, 160px)`,
}));

const Card = styled("div")(({ theme }) => ({
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
}));

const CardImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.3s ease",
});

const Modal = styled(Dialog)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled("div")(({ theme }) => ({
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
}));

const ModalImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain", // Ensure the image fits inside the Dialog
});

const CloseIconStyled = styled(CloseIcon)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  cursor: "pointer",
}));

const ImageGrid = ({ images, currentImageIndex, setCurrentImageIndex }) => {
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

  const isExtraSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isSmall = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "lg")
  );

  let imagesPerLine = 5;
  if (isExtraSmall) {
    imagesPerLine = 2;
  } else if (isSmall) {
    imagesPerLine = 3;
  }

  const totalImages = images.length;
  const numberOfBlanks = 10 - totalImages;
  const filledImages = [...images, ...Array(numberOfBlanks).fill(null)];

  // Define background gradient based on color mode
  const blankSquareGradient =
    colorMode === "dark"
      ? "linear-gradient(135deg, rgba(34, 34, 34, 0.6) 0%, rgba(34, 34, 34, 0.4) 50%)"
      : "linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.8) 50%)";

  return (
    <Container>
      <CardsContainer imagesPerLine={imagesPerLine}>
        {filledImages.map((image, index) => (
          <Card
            key={index}
            style={{
              background: image ? "" : blankSquareGradient,
            }}
            onClick={() => handleClickImage(index)}
          >
            {image && <CardImage src={image} alt={`${index + 1}`} />}
          </Card>
        ))}
      </CardsContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalContent>
          <CloseIconStyled onClick={handleCloseModal} />
          <ModalImage
            src={images[currentImageIndex]}
            alt={`${currentImageIndex + 1}`}
          />
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ImageGrid;
