//Manages the editingLinkup state, handling actions related to setting the editing state.

import {
  SET_EDITING_LINKUP,
  CLEAR_EDITING_LINKUP,
} from "../actions/actionTypes";

const initialState = {
  linkup: null,
};

const editingLinkupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITING_LINKUP:
      return {
        linkup: action.payload.linkup,
      };
    case CLEAR_EDITING_LINKUP:
      return initialState;
    default:
      return state;
  }
};

export default editingLinkupReducer;
