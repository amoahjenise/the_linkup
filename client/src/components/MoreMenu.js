import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Popover, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "../contexts/SnackbarContext";
import LinkupActionModal from "./LinkupActionModal";
import EditLinkupModal from "./EditLinkupModal";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { closeLinkup, deleteLinkup } from "../api/linkUpAPI";
import { useColorMode } from "@chakra-ui/react";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";

// Styled components
const MoreIcon = styled(MoreVertIcon)(({ theme }) => ({
  cursor: "pointer",
}));

const MoreMenu = ({
  showGoToItem,
  showGoToRequest,
  showEditItem,
  showDeleteItem,
  showCloseItem,
  showCheckInLinkup,
  showAcceptLinkupRequest,
  showDeclineLinkupRequest,
  linkupItem,
  refreshFeed,
  menuAnchor,
  setMenuAnchor,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode();

  const [modalState, setModalState] = useState({
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isCloseConfirmationOpen: false,
  });

  const openModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleCheckInClick = () => {
    handleMenuClose();
  };

  const handleAcceptRequestClick = async () => {
    try {
      await acceptLinkupRequest(linkupItem.request_id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: linkupItem.request_id, status: "accepted" },
      });
      refreshFeed();
      addSnackbar("Linkup request accepted.");
    } catch (error) {
      addSnackbar(error.message);
    }
    handleMenuClose();
  };

  const handleDeclineRequestClick = async () => {
    try {
      await declineLinkupRequest(linkupItem.request_id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: linkupItem.request_id, status: "declined" },
      });
      refreshFeed();
      addSnackbar("Linkup request declined.");
    } catch (error) {
      addSnackbar(error.message);
    }
    handleMenuClose();
  };

  const handleEditClick = () => {
    dispatch(setEditingLinkup(linkupItem));
    openModal("isEditModalOpen");
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    openModal("isDeleteModalOpen");
    handleMenuClose();
  };

  const handleCloseClick = () => {
    openModal("isCloseConfirmationOpen");
    handleMenuClose();
  };

  const handleCloseConfirm = async () => {
    try {
      const response = await closeLinkup(linkupItem.id);
      const message = response.success
        ? "Linkup closed successfully!"
        : `Error closing the linkup: ${response.message}`;
      addSnackbar(message, { variant: response.success ? "success" : "error" });
      refreshFeed();
    } catch (error) {
      console.error("An error occurred:", error);
      addSnackbar("An error occurred while closing the linkup", {
        variant: "error",
      });
    } finally {
      handleMenuClose();
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLinkup(linkupItem.id);
      const message = response.success
        ? "Linkup deleted successfully!"
        : `Error deleting linkup: ${response.message}`;
      addSnackbar(message, { variant: response.success ? "success" : "error" });
      refreshFeed();
    } catch (error) {
      console.error("An error occurred:", error);
      addSnackbar("An error occurred while deleting the linkup", {
        variant: "error",
      });
    } finally {
      closeModal("isDeleteModalOpen");
    }
  };

  const handleLinkupRequestClick = () => {
    navigate("/history/requests-received");
    handleMenuClose();
  };

  const handleLinkupItemClick = () => {
    navigate("/history");
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div>
      <MoreIcon onClick={handleMenuClick} />
      <Popover
        style={{ zIndex: 5000 }}
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            minWidth: 200,
            borderRadius: "12px",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
            border:
              colorMode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            color: "white",
            backgroundColor:
              colorMode === "dark"
                ? "rgba(18, 78, 88, 1)"
                : "rgba(8, 98, 110, 1)",
            // boxShadow: "0px 0px 10px 2px rgba(255, 215, 0, 0.3)",
            boxShadow:
              colorMode === "dark"
                ? "0px 0px 10px 2px rgba(255, 215, 0, 0.2)"
                : "0px 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {[
          {
            condition: showGoToItem,
            label: "Go to linkup",
            action: handleLinkupItemClick,
          },
          {
            condition: showGoToRequest,
            label: "Go to linkup request",
            action: handleLinkupRequestClick,
          },
          {
            condition:
              showEditItem &&
              linkupItem.status !== "expired" &&
              linkupItem.status !== "closed",
            label: "Edit this linkup",
            action: handleEditClick,
          },
          {
            condition:
              showAcceptLinkupRequest &&
              linkupItem.status !== "expired" &&
              linkupItem.request_status !== "accepted" &&
              linkupItem.request_status !== "declined" &&
              linkupItem.request_status !== "closed",
            label: "Accept linkup request",
            action: handleAcceptRequestClick,
          },
          {
            condition:
              showDeclineLinkupRequest &&
              linkupItem.status !== "expired" &&
              linkupItem.request_status !== "accepted" &&
              linkupItem.request_status !== "declined" &&
              linkupItem.request_status !== "closed",
            label: "Decline linkup request",
            action: handleDeclineRequestClick,
          },
          {
            condition:
              showCheckInLinkup &&
              linkupItem.status !== "expired" &&
              linkupItem.request_status !== "accepted" &&
              linkupItem.request_status !== "declined" &&
              linkupItem.request_status !== "closed",
            label: "Check-In",
            action: handleCheckInClick,
          },
          {
            condition: showDeleteItem,
            label: "Delete this linkup",
            action: handleDeleteClick,
          },
          {
            condition: showCloseItem,
            label: "Close this linkup",
            action: handleCloseClick,
          },
        ].map(
          (item, index) =>
            item.condition && (
              <MenuItem
                key={index}
                onClick={item.action}
                sx={{
                  py: 0.75,
                  px: 2,
                  fontSize: "0.875rem",
                  gap: 2,
                  "&:hover": {
                    backgroundColor:
                      colorMode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                  "&:active": {
                    backgroundColor:
                      colorMode === "dark"
                        ? "rgba(255, 255, 255, 0.12)"
                        : "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                {item.label}
              </MenuItem>
            )
        )}
      </Popover>
      <LinkupActionModal
        open={modalState.isDeleteModalOpen}
        onClose={() => closeModal("isDeleteModalOpen")}
        onConfirm={handleDeleteConfirm}
        color="red"
        modalTitle="Delete Linkup?"
        modalContentText="Are you sure you want to delete this Linkup? This action cannot be undone - all event details and participant connections will be permanently removed."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
      />
      <EditLinkupModal
        isOpen={modalState.isEditModalOpen}
        onClose={() => closeModal("isEditModalOpen")}
        refreshFeed={refreshFeed}
      />
      <LinkupActionModal
        open={modalState.isCloseConfirmationOpen}
        onClose={() => closeModal("isCloseConfirmationOpen")}
        onConfirm={handleCloseConfirm}
        color="#99DFD6"
        modalTitle="Close Linkup?"
        modalContentText="Are you sure you want to close this linkup? Once closed, no more requests can be received. This action cannot be undone."
        primaryButtonText="Close"
        secondaryButtonText="Cancel"
      />
    </div>
  );
};

export default MoreMenu;
