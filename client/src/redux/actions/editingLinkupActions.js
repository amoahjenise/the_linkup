import { SET_EDITING_LINKUP, CLEAR_EDITING_LINKUP } from "./actionTypes";

export const setEditingLinkup = (linkup) => ({
  type: SET_EDITING_LINKUP,
  payload: { linkup },
});

export const clearEditingLinkup = () => ({
  type: CLEAR_EDITING_LINKUP,
});
