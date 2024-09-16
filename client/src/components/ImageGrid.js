import React from "react";
import { Grid, CardMedia, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import { redirectToInstagramLogin } from "../api/instagramAPI";

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

const ConnectButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: "#C13584", // Instagram brand color
  color: "#FFFFFF",
  borderRadius: "5px",
  textTransform: "none",
  padding: theme.spacing(1, 2),
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#C13584",
  },
}));

const ImageGrid = ({ images, isMobile, isLoggedUserProfile }) => {
  const { colorMode } = useColorMode();

  const handleError = (event) => {
    event.target.src = PlaceholderImage;
  };

  return (
    <Grid container spacing={0.5}>
      {images.length === 0 ? (
        <Grid item xs={12}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%" // Ensure full height for the card
            width="100%" // Ensure full width for the card
            textAlign="center"
          >
            {isLoggedUserProfile ? (
              <ConnectButton
                size="large"
                aria-label="Connect Instagram"
                onClick={() => {
                  if (isLoggedUserProfile) redirectToInstagramLogin();
                }}
              >
                Connect Instagram
              </ConnectButton>
            ) : (
              <Typography style={{ padding: 8 }} variant="h6" gutterBottom>
                The user hasn't linked their account to Instagram yet.
              </Typography>
            )}
          </Box>
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
