import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Popover, MenuItem } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "../contexts/SnackbarContext";
import DeleteModal from "./DeleteModal";
import EditLinkupModal from "./EditLinkupModal";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { closeLinkup, deleteLinkup } from "../api/linkupAPI";
import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal component
import { useColorMode } from "@chakra-ui/react";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";

const useStyles = makeStyles((theme) => ({
  moreIcon: {
    cursor: "pointer",
  },
}));

const HorizontalMenu = ({
  showGoToItem,
  showGoToRequest,
  showEditItem,
  showDeleteItem,
  showCloseItem,
  showCheckInLinkup, // Ation for checking in the linkup
  showAcceptLinkupRequest,
  showDeclineLinkupRequest,
  linkupItem,
  menuAnchor,
  setMenuAnchor,
  setShouldFetchLinkups,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode();

  // Define a single state for both modals
  const [modalState, setModalState] = useState({
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isCloseConfirmationOpen: false,
  });

  const openModal = (modalName) => {
    setModalState({ ...modalState, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setModalState({ ...modalState, [modalName]: false });
  };

  const handleCheckInClick = () => {
    // Add your logic for checking in the linkup here
    handleMenuClose();
  };

  const handleAcceptRequestClick = async () => {
    try {
      await acceptLinkupRequest(linkupItem.request_id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: linkupItem.request_id, status: "accepted" },
      });
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request accepted.");
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
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request declined.");
    } catch (error) {
      addSnackbar(error.message);
    }
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

  const handleCloseClick = async () => {
    // Open the completion confirmation dialog
    openModal("isCloseConfirmationOpen");
    handleMenuClose(); // Close the main menu
  };

  const handleCloseConfirm = async () => {
    try {
      const response = await closeLinkup(linkupItem.id);
      const message = response.success
        ? "Link-up closed successfully!"
        : `Error closing the link-up: ${response.message}`;
      addSnackbar(message, { variant: response.success ? "success" : "error" });
      setShouldFetchLinkups(true);
    } catch (error) {
      console.error("An error occurred:", error);
      addSnackbar("An error occurred while closing the link-up", {
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
        ? "Link-up deleted successfully!"
        : `Error deleting link-up: ${response.message}`;
      addSnackbar(message, { variant: response.success ? "success" : "error" });
      setShouldFetchLinkups(true);
    } catch (error) {
      console.error("An error occurred:", error);
      addSnackbar("An error occurred while deleting the link-up", {
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
      <MoreHorizIcon onClick={handleMenuClick} className={classes.moreIcon} />
      <Popover
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
            color: "white",
            backgroundColor:
              colorMode === "dark"
                ? "rgba(18, 78, 88, 0.95)"
                : "rgba(8, 98, 110, 0.75)",
            boxShadow: "0px 0px 10px 2px rgba(255, 215, 0, 0.5)",
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
              <MenuItem key={index} onClick={item.action}>
                {item.label}
              </MenuItem>
            )
        )}
      </Popover>
      <DeleteModal
        open={modalState.isDeleteModalOpen}
        onClose={() => closeModal("isDeleteModalOpen")}
        onConfirm={handleDeleteConfirm}
      />
      <EditLinkupModal
        isOpen={modalState.isEditModalOpen}
        onClose={() => closeModal("isEditModalOpen")}
        setShouldFetchLinkups={setShouldFetchLinkups}
      />
      {/* Use the ConfirmationModal */}
      <ConfirmationModal
        open={modalState.isCloseConfirmationOpen}
        onClose={() => closeModal("isCloseConfirmationOpen")}
        onConfirm={handleCloseConfirm}
        title="Confirm"
        message={
          <>
            Are you sure you want to close this linkup?
            <br />
            Once closed, no more requests can be received.
            <br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default HorizontalMenu;
