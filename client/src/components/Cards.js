import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  cardsContainer: {
    position: "relative",
    width: "400px",
    height: "400px",
    overflow: "hidden",
    // borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
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
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  },
  imageStack: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  imageStackItem: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    "&:last-child": {
      border: "none",
    },
  },
}));

const Cards = ({ images }) => {
  const classes = useStyles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className={classes.cardsContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={classes.card}
          onClick={handleClickImage}
          style={{
            transform: `translateX(${
              -100 * (index - currentImageIndex)
            }%) rotate(${index - currentImageIndex}deg)`,
            zIndex: index === currentImageIndex ? 2 : 1,
          }}
        >
          <img src={image} alt="User" className={classes.cardImage} />
        </div>
      ))}
      {images.length > 1 && (
        <div className={classes.imageStack}>
          {images.slice(1).map((image, index) => (
            <Avatar
              key={index}
              src={image}
              alt="User Avatar"
              className={classes.imageStackItem}
              style={{ zIndex: images.length - index - 1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;
