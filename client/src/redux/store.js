import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const middleware =
  process.env.NODE_ENV === "development"
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["logout", "registration"], // Exclude the "registration" reducer from being persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, middleware);
export const persistor = persistStore(store, null, () => {});
