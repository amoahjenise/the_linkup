import React from "react";
import { Grid, CardMedia, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const StyledCard = styled("div")(({ theme, colorMode }) => ({
  position: "relative",
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`, // Line of separation
  backgroundColor: colorMode === "dark" ? "transparent" : "white",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  aspectRatio: "1 / 1", // Makes the card square
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ensures the image covers the area without distortion
}));

const PlaceholderImage = "path/to/placeholder-image.jpg"; // Replace with your placeholder image

const BouncingArrow = styled("div")(({ theme, isMobile }) => ({
  ...(isMobile
    ? {}
    : {
        position: "absolute",
        bottom: "30px", // Adjust positioning as needed
        width: "0",
        height: "0",
        left: "47.6%", // Adjust positioning as needed
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderBottom: `15px solid #c13584`, // Default arrow color for Instagram
        animation: "bounce 1.5s infinite",
        "&.twitter": {
          borderBottomColor: "#1DA1F2", // Twitter blue
          left: "56%", // Adjust positioning as needed
        },
        "&.facebook": {
          borderBottomColor: "#3a5191", // Facebook blue
          left: "38.5%", // Adjust positioning as needed
        },
      }),
}));

const ArrowContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "600px", // Adjust size as needed
  margin: "0 auto",
  padding: theme.spacing(2), // Add padding around the carousel
}));

const carouselSettings = {
  dots: false,
  infinite: true,
  speed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false, // Disable default arrows
  autoplay: true, // Enable autoplay
  autoplaySpeed: 4500, // Set speed for autoplay (4.5 seconds)
};

const messages = [
  {
    text: "Connect to Instagram to see your photos!",
    arrowClass: "",
  },
  {
    text: "Connect to Twitter X for updates!",
    arrowClass: "twitter",
  },
  {
    text: "Connect to Facebook to see your photos!",
    arrowClass: "facebook",
  },
];

const ImageGrid = ({ images, isMobile, isLoggedUserProfile }) => {
  const { colorMode } = useColorMode();

  const handleError = (event) => {
    event.target.src = PlaceholderImage;
  };

  return (
    <Grid container spacing={0.5}>
      {images.length === 0 ? (
        <Grid item xs={12}>
          {isLoggedUserProfile && (
            <Grid item xs={12}>
              <CarouselContainer>
                <Slider {...carouselSettings}>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%" // Ensure full height for the card
                      border="1px solid lightgrey" // Line of separation
                    >
                      <StyledCard colorMode={colorMode}>
                        <ArrowContainer>
                          <Typography variant="h6" gutterBottom>
                            {message.text}
                          </Typography>
                          <BouncingArrow
                            className={message.arrowClass}
                            isMobile={isMobile}
                          />
                        </ArrowContainer>
                      </StyledCard>
                    </Box>
                  ))}
                </Slider>
              </CarouselContainer>
            </Grid>
          )}
          {!isLoggedUserProfile && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%" // Ensure full height for the card
            >
              <StyledCard
                colorMode={colorMode}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  The user hasn't linked their account to Instagram yet.
                </Typography>
              </StyledCard>
            </Box>
          )}
        </Grid>
      ) : (
        images.map((image, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <StyledCard colorMode={colorMode}>
              <StyledCardMedia
                component="img"
                alt={`Image ${index}`}
                image={image}
                title={`Image ${index}`}
                onError={handleError}
              />
            </StyledCard>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ImageGrid;
