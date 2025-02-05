import React, { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography, IconButton, styled } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import LinkupItem from "./LinkupItem";
import { getUserLinkups } from "../api/linkUpAPI";

const ModalContainer = styled(Box)(({ theme, colorMode }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
  backgroundColor: colorMode === "light" ? "#ffffff" : "#333333",
  borderRadius: "12px",
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(3),
  transition: "all 0.3s ease-in-out",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    transform: "none",
    borderRadius: "0",
    maxHeight: "none",
  },
}));

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: "rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

const LinkupsModal = ({ userId, open, onClose }) => {
  const { colorMode } = useColorMode();
  const [linkups, setLinkups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef(null);
  const startY = useRef(0);

  useEffect(() => {
    const fetchLinkups = async () => {
      try {
        const response = await getUserLinkups(userId);
        if (response.success) {
          setLinkups(response.linkupList);
        }
      } catch (error) {
        console.error("Failed to fetch linkups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchLinkups();
    }
  }, [open, userId]);

  // Handle swipe down to close on mobile
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 100) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer
        ref={modalRef}
        colorMode={colorMode}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: colorMode === "light" ? "#333333" : "white" }}
        >
          Created Linkups
        </Typography>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : linkups.length > 0 ? (
          linkups.map((linkup) => (
            <LinkupItem
              key={linkup.id}
              linkupItem={linkup}
              setShouldFetchLinkups={() => {}}
              disableRequest={true}
            />
          ))
        ) : (
          <Typography>No linkups found.</Typography>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default LinkupsModal;
