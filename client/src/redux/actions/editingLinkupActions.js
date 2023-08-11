export const SET_EDITING_LINKUP = "SET_EDITING_LINKUP";
export const CLEAR_EDITING_LINKUP = "CLEAR_EDITING_LINKUP";

export const setEditingLinkup = (linkupId, isEditing) => ({
  type: SET_EDITING_LINKUP,
  payload: { linkupId, isEditing },
});

export const clearEditingLinkup = () => ({
  type: CLEAR_EDITING_LINKUP,
});
