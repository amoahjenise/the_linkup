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
import { SocketProvider } from "./contexts/SocketContext";
import { ClerkProvider } from "@clerk/clerk-react";
import { PrimeReactProvider } from "primereact/api";
import { dark } from "@clerk/themes";

Modal.setAppElement("#root");

const root = ReactDOM.createRoot(document.getElementById("root"));
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        publishableKey={clerkPubKey}
      >
        <SnackbarProvider>
          <SocketProvider>
            <React.StrictMode>
              <ChakraProvider theme={theme}>
                <ColorModeScript
                  initialColorMode={theme.config.initialColorMode}
                />
                <PrimeReactProvider>
                  <App />
                </PrimeReactProvider>
              </ChakraProvider>
            </React.StrictMode>
          </SocketProvider>
        </SnackbarProvider>
      </ClerkProvider>
    </PersistGate>
  </Provider>
);
