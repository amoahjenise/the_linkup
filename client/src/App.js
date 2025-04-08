import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { setUnreadMessagesCount } from "./redux/actions/messageActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { getUnreadMessagesCount } from "./api/sendbirdAPI";
import {
  LandingPage,
  SignupPage,
  HomePage,
  UserProfilePage,
  SendRequestPage,
  ConversationsPage,
  LinkUpHistoryPage,
  NotificationsPage,
  AcceptDeclinePage,
  TermsOfServicePage,
  SettingsPage,
  PrivacyPolicyPage,
  CookieUsePage,
  UserDataDeletionPage,
  PricingPage,
} from "./pages";
import ErrorPage from "./components/ErrorPage";
import LeftMenu from "./components/LeftMenu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  authenticateUser,
  storeUserOnlineStatus,
} from "./api/authenticationAPI";
import { setCurrentUser } from "./redux/actions/userActions";
import { login } from "./redux/actions/authActions";
import { useUser, useSession } from "@clerk/clerk-react";
import "@sendbird/uikit-react/dist/index.css";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { TypingIndicatorType } from "@sendbird/uikit-react";
import { useColorMode } from "@chakra-ui/react";

const MOBILE_BREAKPOINT = "600px";

const publicPages = [
  "/",
  "/sign-in",
  "/sign-up",
  "/terms-of-service",
  "/privacy-policy",
  "/cookie-use",
  "/data-deletion-instructions",
  "/registration",
];

const AppWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isAuthenticated",
})(({ theme, isAuthenticated }) => ({
  ...(isAuthenticated && {
    display: "flex",
    height: "100dvh",
    overflow: "hidden",
    "@media (max-width: 900px)": {
      paddingBottom: "60px", // Add padding for footer
    },
  }),
}));

const RoutesComponent = ({ isMobile }) => (
  <Routes>
    <Route path="/" exact element={<LandingPage />} />
    <Route path="/registration" element={<SignupPage />} />
    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/cookie-use" element={<CookieUsePage />} />
    <Route
      path="/data-deletion-instructions"
      element={<UserDataDeletionPage />}
    />
    <Route path="/home" element={<HomePage isMobile={isMobile} />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route
      path="/profile/:id"
      element={<UserProfilePage isMobile={isMobile} />}
    />
    <Route path="/send-request/:linkupId" element={<SendRequestPage />} />
    <Route
      path="/history"
      element={<LinkUpHistoryPage isMobile={isMobile} />}
    />
    <Route
      path="/history/expired"
      element={<LinkUpHistoryPage isMobile={isMobile} />}
    />
    <Route
      path="/history/requests-sent"
      element={<LinkUpHistoryPage isMobile={isMobile} />}
    />
    <Route
      path="/history/requests-received"
      element={<LinkUpHistoryPage isMobile={isMobile} />}
    />
    <Route
      path="/messages"
      element={<ConversationsPage isMobile={isMobile} />}
    />
    <Route path="/linkup-request/:id" element={<AcceptDeclinePage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/Error" element={<ErrorPage />} />
    <Route path="/pricing" element={<PricingPage isMobile={isMobile} />} />
  </Routes>
);

const App = () => {
  const dispatch = useDispatch();
  const { isSignedIn } = useSession();
  const userState = useSelector((state) => state.loggedUser);
  const { isRegistering } = useSelector((state) => state.registration);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSigningOut } = useSelector((state) => state.logout);
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const [authError, setAuthError] = useState(false);
  const { colorMode } = useColorMode();

  const myColorSet = {
    "--sendbird-light-primary-500": "#00487c",
    "--sendbird-light-primary-400": "#346382",
    "--sendbird-light-primary-300": "#3e6680",
    "--sendbird-light-primary-200": "#0496ff",
    "--sendbird-light-primary-100": "#f2f5f7",
    "--sendbird-dark-primary-500": "#00487c",
    "--sendbird-dark-primary-400": "#00487c",
    "--sendbird-dark-primary-300": "#7cd6c9",
    "--sendbird-dark-primary-200": "#92d4ca",
    "--sendbird-dark-primary-100": "#dbd1ff",
    "--sendbird-dark-secondary-100": "#a8e2ab",
    "--sendbird-dark-secondary-200": "#69c085",
    "--sendbird-dark-secondary-300": "#259c72",
    "--sendbird-dark-secondary-400": "#027d69",
    "--sendbird-dark-secondary-500": "#066858",
    "--sendbird-dark-background-600": "black", // Sendbird Container background in dark mode
    "--sendbird-dark-background-700": "#1b2330",
    "--sendbird-light-onlight-04": "#cbcbcb", // text disabled color in light mode
    "--sendbird-dark-ondark-04": "#e6e6e6", // text disabled color in dark mode
  };

  const myStringSet = {
    MESSAGE_INPUT__PLACE_HOLDER__DISABLED:
      "This chat is temporarily disabled until the recipient responds or accepts the request.",
  };

  const REACT_APP_SENDBIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;

  // Detect if the device is mobile
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Hide the address bar on mobile devices
  useEffect(() => {
    if (isMobileDevice) {
      // Trigger scroll after a short delay
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    }
  }, [isMobileDevice]);

  useEffect(() => {
    const handleOnlineStatus = async () => {
      if (isSignedIn && userState?.user?.id) {
        // Store user as online in the database
        await storeUserOnlineStatus(userState.user.id, true);
      }
    };

    const handleCleanup = async () => {
      if (isSignedIn && userState?.user?.id) {
        // Store user as offline in the database
        await storeUserOnlineStatus(userState.user.id, false);
      }
    };

    // Handle online status
    (async () => {
      await handleOnlineStatus();
    })();

    // Cleanup function
    return () => {
      (async () => {
        await handleCleanup();
      })();
    };
  }, [isSignedIn, userState?.user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || isSigningOut || !user?.id || isRegistering) return;

      try {
        const result = await authenticateUser(user.id);
        console.log(result);

        if (result.success) {
          dispatch(setCurrentUser(result.user));
          dispatch(login());
        } else {
          setAuthError(true);
        }
      } catch (error) {
        console.error("Error during user data fetch:", error);
        setAuthError(true);
      }
    };
    fetchData();
  }, [user, isAuthenticated, isSigningOut, dispatch, isRegistering]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAuthenticated || isSigningOut || isRegistering) return;
      try {
        const messagesCount = await getUnreadMessagesCount(userState?.user?.id);
        dispatch(setUnreadMessagesCount(Number(messagesCount.unread_count)));
        const notificationsCount = await getUnreadNotificationsCount(
          userState?.user?.id
        );
        dispatch(
          updateUnreadNotificationsCount(Number(notificationsCount.unreadCount))
        );
      } catch (error) {
        console.error("Error during user data fetch.", error);
      }
    };
    fetchData();
  }, [
    dispatch,
    user,
    userState?.user?.id,
    isAuthenticated,
    isSigningOut,
    isRegistering,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <SendbirdProvider
        breakpoint={MOBILE_BREAKPOINT}
        appId={REACT_APP_SENDBIRD_APP_ID}
        userId={userState?.user?.id}
        accessToken={userState?.user?.access_token}
        theme={colorMode === "light" ? "light" : "dark"}
        colorSet={myColorSet}
        stringSet={myStringSet}
        uikitOptions={{
          groupChannel: {
            enableTypingIndicator: true,
            typingIndicatorTypes: new Set([
              TypingIndicatorType.Bubble,
              TypingIndicatorType.Text,
            ]),
          },
        }}
      >
        <BrowserRouter>
          <AppWrapper isAuthenticated={isAuthenticated}>
            {/* {isAuthenticated && !isRegistering && (
              <LeftMenu isMobile={isMobile} />
            )} */}
            {publicPages.includes(window.location.pathname) ? (
              <RoutesComponent isMobile={isMobile} userState={userState} />
            ) : (
              <>
                <SignedIn>
                  {authError ? (
                    <ErrorPage />
                  ) : (
                    <RoutesComponent
                      isMobile={isMobile}
                      userState={userState}
                    />
                  )}
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
          </AppWrapper>
        </BrowserRouter>
      </SendbirdProvider>
    </ThemeProvider>
  );
};

export default App;
