import React from "react";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { IconButton } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";

// Define styled components
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  flexGrow: 1,
  position: "sticky",
  top: 0,
}));

const AppBar = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  height: "50px",
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  borderBottomWidth: "1px",
  borderBottomColor: "0.1px solid #D3D3D3",
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor:
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.19)"
      : "rgba(255, 255, 255, 0.99)",
}));

const CameraIconButton = styled(IconButton)(({ colorMode }) => ({
  marginLeft: "auto",
  color: colorMode === "dark" ? "white" : "black",
}));

const ImageGridHeader = ({ openImageUploadModal }) => {
  const { colorMode } = useColorMode();

  return (
    <Root>
      <AppBar colorMode={colorMode} elevation={0}>
        <CameraIconButton
          aria-label="Upload Avatar"
          onClick={openImageUploadModal}
          colorMode={colorMode}
          size="large"
        >
          <PhotoCameraIcon />
        </CameraIconButton>
      </AppBar>
    </Root>
  );
};

export default ImageGridHeader;
