import React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

// Styled component
const AdContainer = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: "20px auto",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const AdWidget = ({ imageUrl, title, description, link }) => {
  return (
    <AdContainer>
      <CardMedia component="img" height="180" image={imageUrl} alt="Ad" />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          href={link}
          target="_blank"
        >
          Learn More
        </Button>
      </CardContent>
    </AdContainer>
  );
};

export default AdWidget;

// import React, { useEffect } from "react";

// const AdWidget = () => {
//   useEffect(() => {
//     (window.adsbygoogle = window.adsbygoogle || []).push({});
//   }, []);

//   return (
//     <div style={{ textAlign: "center", margin: "20px 0" }}>
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block" }}
//         data-ad-client="ca-pub-XXXXXXXXXX"
//         data-ad-slot="YYYYYYYYYY"
//         data-ad-format="auto"
//       />
//     </div>
//   );
// };

// export default AdWidget;
