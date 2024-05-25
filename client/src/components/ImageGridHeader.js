import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flexGrow: 1,
    position: "sticky",
    top: 0,
  },
  appBar: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderTopColor: "1px solid #D3D3D3",
    borderBottomColor: "1px solid #D3D3D3",
  },
  cameraIcon: {
    marginLeft: "auto",
  },
}));

const ImageGridHeader = ({ isLoggedUserProfile, openImageUploadModal }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const color =
    colorMode === "dark"
      ? "white" // Dark mode text color white
      : "black"; // Light mode text color

  const backgroundColor =
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.19)" // Dark mode background color with 90% transparency
      : "rgba(255, 255, 255, 0.99)"; // Light mode background color

  return (
    <div className={classes.root}>
      <AppBar
        className={classes.appBar}
        elevation={0}
        style={{ color, backgroundColor }}
      >
        {/* Render upload camera button */}
        {isLoggedUserProfile && (
          <IconButton
            className={classes.cameraIcon}
            aria-label="Upload Avatar"
            onClick={openImageUploadModal}
            style={{ color }}
          >
            <PhotoCameraIcon />
          </IconButton>
        )}
      </AppBar>
    </div>
  );
};

export default ImageGridHeader;
