import React, { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography, IconButton, styled } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { getUserLinkups } from "../api/linkUpAPI";
import CreatedLinkupItem from "./CreatedLinkupItem";

const ModalContainer = styled(Box)(({ theme, colorMode }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  maxHeight: "80vh",
  overflow: "hidden",
  backgroundColor: colorMode === "light" ? "#ffffff" : "#222222",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
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

const Header = styled(Box)(({ theme, colorMode }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: colorMode === "light" ? "#ffffff" : "#222222",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${colorMode === "light" ? "#ddd" : "#444"}`,
}));

const CloseButton = styled(IconButton)({
  color: "inherit",
});

const Content = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "8px 12px", // Reduced padding for tighter layout
});

const LinkupsModal = ({ userId, open, onClose }) => {
  const { colorMode } = useColorMode();
  const [linkups, setLinkups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const contentRef = useRef(null);
  const startY = useRef(0);
  const [isAtTop, setIsAtTop] = useState(true);

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

  // Check scroll position
  const handleScroll = () => {
    if (contentRef.current) {
      setIsAtTop(contentRef.current.scrollTop === 0);
    }
  };

  // Handle swipe down to close on mobile
  const handleTouchStart = (e) => {
    // Only start tracking if at top of content
    if (isAtTop) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (!isAtTop) return; // Only allow swipe when at top

    const deltaY = e.touches[0].clientY - startY.current;
    // Require larger swipe distance (150px) and only downward
    if (deltaY > 150) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer
        colorMode={colorMode}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <Header colorMode={colorMode}>
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            Created Linkups
          </Typography>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content ref={contentRef} onScroll={handleScroll}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : linkups.length > 0 ? (
            linkups.map((linkup, index) => (
              <Box
                key={linkup.id}
                sx={{
                  marginBottom: index !== linkups.length - 1 ? "6px" : "0px",
                }}
              >
                <CreatedLinkupItem
                  key={linkup.id}
                  linkupItem={linkup}
                  setShouldFetchLinkups={setShouldFetchLinkups}
                  disableRequest={true}
                />
              </Box>
            ))
          ) : (
            <Typography>No linkups found.</Typography>
          )}
        </Content>
      </ModalContainer>
    </Modal>
  );
};

export default LinkupsModal;
