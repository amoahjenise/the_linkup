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
import { markLinkupAsCompleted, deleteLinkup } from "../api/linkupAPI";
import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal component

const useStyles = makeStyles((theme) => ({
  moreIcon: {
    cursor: "pointer",
  },
}));

const HorizontalMenu = ({
  showGoToItem,
  showEditItem,
  showDeleteItem,
  showCompleteItem,
  linkupItem,
  menuAnchor,
  setMenuAnchor,
  setShouldFetchLinkups,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();

  // Define a single state for both modals
  const [modalState, setModalState] = useState({
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isCompleteConfirmationOpen: false,
  });

  const openModal = (modalName) => {
    setModalState({ ...modalState, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setModalState({ ...modalState, [modalName]: false });
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

  const handleCompleteClick = async () => {
    // Open the completion confirmation dialog
    openModal("isCompleteConfirmationOpen");
    handleMenuClose(); // Close the main menu
  };

  const handleCompleteConfirm = async () => {
    try {
      const response = await markLinkupAsCompleted(linkupItem.id);
      const message = response.success
        ? "Link-up completed successfully!"
        : `Error completing link-up: ${response.message}`;
      addSnackbar(message, { variant: response.success ? "success" : "error" });
      setShouldFetchLinkups(true);
    } catch (error) {
      console.error("An error occurred:", error);
      addSnackbar("An error occurred while completing the link-up", {
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
          horizontal: "right",
        }}
      >
        {[
          {
            condition: showGoToItem,
            label: "Go to linkup",
            action: handleLinkupItemClick,
          },
          {
            condition: showEditItem,
            label: "Edit this linkup",
            action: handleEditClick,
          },
          {
            condition: showDeleteItem,
            label: "Delete this linkup",
            action: handleDeleteClick,
          },
          {
            condition: showCompleteItem,
            label: "Mark as completed",
            action: handleCompleteClick,
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
        open={modalState.isCompleteConfirmationOpen}
        onClose={() => closeModal("isCompleteConfirmationOpen")}
        onConfirm={handleCompleteConfirm}
        title="Confirm Completion"
        message="You're about to complete and close this linkup."
      />
    </div>
  );
};

export default HorizontalMenu;
