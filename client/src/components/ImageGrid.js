import React from "react";
import { Grid, Card, CardMedia, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`, // Line of separation
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  aspectRatio: "1 / 1", // Makes the card square
  width: "100%",
  objectFit: "cover", // Ensures the image covers the area without distortion
}));

const PlaceholderImage = "path/to/placeholder-image.jpg"; // Replace with your placeholder image

const MessageBox = styled(Box)(({ theme, isLoggedUser }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  textAlign: "center",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  backgroundColor: "rgba(224, 224, 224, 0.1)", // Updated to correct value
  border: `1px solid ${
    isLoggedUser ? theme.palette.primary.dark : theme.palette.grey[400]
  }`,
  position: "relative",
}));

const BouncingArrow = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "73%", // Adjust to position the arrow correctly
  width: "0",
  height: "0",
  borderLeft: "15px solid transparent",
  borderRight: "15px solid transparent",
  borderBottom: `15px solid #c13584`, // Arrow color
  animation: "bounce 3s infinite",
}));

const ImageGrid = ({ images, isLoggedUserProfile, isMobile }) => {
  const handleError = (event) => {
    event.target.src = PlaceholderImage;
  };

  return (
    <Grid container spacing={0.5}>
      {images.length === 0 ? (
        <Grid item xs={12}>
          <MessageBox isLoggedUserProfile={isLoggedUserProfile}>
            {isLoggedUserProfile && (
              <>
                <BouncingArrow />
                <Typography variant="h6" gutterBottom>
                  Connect to Instagram to see your photos!
                </Typography>
              </>
            )}
            {!isLoggedUserProfile && (
              <Typography variant="h6" gutterBottom>
                The user hasn't linked their account to Instagram yet.
              </Typography>
            )}
          </MessageBox>
        </Grid>
      ) : (
        images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StyledCard>
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
