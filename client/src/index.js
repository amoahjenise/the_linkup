import React from "react";
import ReactDOM from "react-dom/client";
import theme from "./theme";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Modal from "react-modal";
import { SocketProvider } from "./SocketContext";

Modal.setAppElement("#root"); // Assuming your root element has an id of 'root'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {" "}
      <SnackbarProvider>
        <SocketProvider>
          <React.StrictMode>
            <ChakraProvider theme={theme}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <App />
            </ChakraProvider>
          </React.StrictMode>
        </SocketProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
);
