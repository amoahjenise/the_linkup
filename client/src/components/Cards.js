import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardsContainer: {
    position: "relative",
    width: "410px",
    height: "410px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: theme.spacing(1),
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageStack: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center horizontally
    gap: "24px",
  },
  imageStackItem: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    cursor: "pointer",
  },
  cameraIconContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  cameraIcon: {
    position: "relative",
    top: "50px",
    left: "205px",
    border: "1px solid #e1e8ed",
    width: "50px",
    height: "50px",
    backgroundColor: theme.palette.primary.contrastText,
    zIndex: 1,
    marginBottom: theme.spacing(2),
    margin: "0 auto", // Center horizontally
    transition: "background-color 0.4s ease",
    "&:hover": {
      backgroundColor: "lightgray",
    },
  },
}));

const Cards = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  isLoggedUserProfile,
  isImageUploadModalOpen,
  openImageUploadModal,
}) => {
  const classes = useStyles();

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleClickImage = (event) => {
    const cardWidth = event.currentTarget.offsetWidth;
    const clickX =
      event.clientX - event.currentTarget.getBoundingClientRect().left;
    const isLeftClick = clickX < cardWidth / 2;

    if (isLeftClick) {
      handlePreviousImage();
    } else {
      handleNextImage();
    }
  };

  const handleClickAvatar = (index) => {
    setCurrentImageIndex(index);
  };

  const renderUploadPicturesButton = () => {
    if (isLoggedUserProfile && !isImageUploadModalOpen) {
      return (
        <IconButton
          className={classes.cameraIcon}
          component="span"
          aria-label="Upload Avatar"
          onClick={openImageUploadModal}
        >
          <PhotoCameraIcon />
        </IconButton>
      );
    }
    return null;
  };

  return (
    <div className={classes.container}>
      <div className={classes.cameraIconContainer}>
        {renderUploadPicturesButton()}
        <div className={classes.cardsContainer}>
          {images.map((image, index) => (
            <div
              key={index}
              className={classes.card}
              onClick={handleClickImage}
              style={{
                transform: `translateX(${(currentImageIndex - index) * 100}%)`,
              }}
            >
              <img src={image} alt="User" className={classes.cardImage} />
            </div>
          ))}
        </div>
        <div className={classes.imageStack}>
          {images.map((image, index) => (
            <Avatar
              key={index}
              src={image}
              alt="User Avatar"
              className={classes.imageStackItem}
              onClick={() => handleClickAvatar(index)}
              style={{
                border:
                  index === currentImageIndex
                    ? "2px solid #ff6b6b"
                    : "2px solid #fff",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
