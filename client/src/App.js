import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { setUnreadMessagesCount } from "./redux/actions/messageActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { getUnreadMessagesCount } from "./api/sendbirdAPI";
import ClerkCustomSignIn from "./sign-in/[[...index]]";
import ClerkCustomSignUp from "./sign-up/[[...index]]";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import SendRequestPage from "./pages/SendRequestPage";
import ConversationsPage from "./pages/ConversationsPage";
import LinkupHistoryPage from "./pages/LinkupHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AcceptDeclinePage from "./pages/AcceptDeclinePage";
import SettingsPage from "./pages/SettingsPage";
import ErrorPage from "./components/ErrorPage";
import LeftMenu from "./components/LeftMenu";
import ToggleColorMode from "./components/ToggleColorMode";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { authenticateUser } from "./api/authenticationAPI";
import { setCurrentUser } from "./redux/actions/userActions";
import { login } from "./redux/actions/authActions";
import { useUser } from "@clerk/clerk-react";
import "@sendbird/uikit-react/dist/index.css";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { TypingIndicatorType } from "@sendbird/uikit-react";
import { useColorMode } from "@chakra-ui/react";
import Geolocation from "./components/Geolocation";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    height: "100vh",
  },
}));

const publicPages = ["/", "/sign-in", "/sign-up"];

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSigningOut } = useSelector((state) => state.logout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useUser();
  const [authError, setAuthError] = useState(false);
  const { colorMode } = useColorMode();

  const myColorSet = {
    "--sendbird-light-primary-500": "#00487c",
    "--sendbird-light-primary-400": "#346382",
    "--sendbird-light-primary-300": "#3e6680",
    "--sendbird-light-primary-200": "#0496ff",
    "--sendbird-light-primary-100": "#f2f5f7", // Selected conversation color
    // Dark theme primary colors
    "--sendbird-dark-primary-500": "#00487c", //
    "--sendbird-dark-primary-400": "#00487c", // On hover color
    "--sendbird-dark-primary-300": "#7cd6c9", // Left border plus chat bubble on hover color
    "--sendbird-dark-primary-200": "#92d4ca", // Chat bubble color
    "--sendbird-dark-primary-100": "#dbd1ff", // Color on selection
    // Dark theme secondary colors
    "--sendbird-dark-secondary-100": "#a8e2ab", // Dark secondary color (highest brightness)
    "--sendbird-dark-secondary-200": "#69c085", // Dark secondary color
    "--sendbird-dark-secondary-300": "#259c72", // Dark secondary color
    "--sendbird-dark-secondary-400": "#027d69", // Dark secondary color
    "--sendbird-dark-secondary-500": "#066858", // Dark secondary color (lowest brightness)
    // Dark theme background colors
    "--sendbird-dark-background-600": "#1f2733", // Background
    "--sendbird-dark-background-700": "#1b2330", // Selected conversation color
  };

  const myStringSet = {
    MESSAGE_INPUT__PLACE_HOLDER__DISABLED:
      "This chat is temporarily disabled until the recipient responds or accepts the request.",
  };

  const REACT_APP_SENDBIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;
  const REACT_APP_SENDBIRD_APP_ACCESS_TOKEN =
    process.env.REACT_APP_SENDBIRD_APP_ACCESS_TOKEN;

  useEffect(() => {
    async function fetchData() {
      if (!user) return null;
      const clerkUserId = user?.id;

      try {
        if (!isAuthenticated && !isSigningOut && clerkUserId) {
          const result = await authenticateUser(clerkUserId);
          if (result.success) {
            dispatch(setCurrentUser(result.user));
            dispatch(login());
          } else {
            setAuthError(true); // Set the authentication error state
          }
        }
      } catch (error) {
        console.error("Error during user data fetch:", error);
        setAuthError(true); // Set the authentication error state
      }
    }
    fetchData();
  }, [user, isAuthenticated, isSigningOut, dispatch]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user) return null;

        // Fetch unread messages count and update Redux state
        const messagesCount = await getUnreadMessagesCount(userState?.user?.id);
        dispatch(setUnreadMessagesCount(Number(messagesCount.unread_count)));

        // Fetch unread notifications count and update Redux state
        const notificationsCount = await getUnreadNotificationsCount(
          userState?.user?.id
        );
        dispatch(
          updateUnreadNotificationsCount(Number(notificationsCount.unreadCount))
        );
      } catch (error) {
        console.error("Error during user data fetch:", error);
      }
    }

    fetchData();
  }, [dispatch, user, userState?.user?.id]);

  const RoutesComponent = () => (
    <Routes>
      <Route path="/" exact element={<LandingPage isMobile={isMobile} />} />
      <Route path="/sign-in/*" element={<ClerkCustomSignIn />} />
      <Route path="/sign-up/*" element={<ClerkCustomSignUp />} />
      <Route path="/registration" element={<SignupPage />} />
      <Route
        path="/home"
        element={
          locationState.allow_location &&
          locationState.city &&
          locationState.country ? (
            <HomePage isMobile={isMobile} />
          ) : (
            <Geolocation />
          )
        }
      />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route
        path="/profile/:id"
        element={<UserProfilePage isMobile={isMobile} />}
      />
      <Route path="/send-request/:linkupId" element={<SendRequestPage />} />
      <Route
        path="/history"
        element={<LinkupHistoryPage isMobile={isMobile} />}
      />
      <Route
        path="/history/expired"
        element={<LinkupHistoryPage isMobile={isMobile} />}
      />
      <Route
        path="/history/requests-sent"
        element={<LinkupHistoryPage isMobile={isMobile} />}
      />
      <Route
        path="/history/requests-received"
        element={<LinkupHistoryPage isMobile={isMobile} />}
      />
      <Route
        path="/messages"
        element={<ConversationsPage isMobile={isMobile} />}
      />
      <Route path="/linkup-request/:id" element={<AcceptDeclinePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );

  return (
    <ThemeProvider theme={theme}>
      <ToggleColorMode>
        <SendbirdProvider
          appId={REACT_APP_SENDBIRD_APP_ID}
          userId={userState?.user?.id}
          accessToken={REACT_APP_SENDBIRD_APP_ACCESS_TOKEN}
          theme={colorMode === "light" ? "light" : "dark"}
          colorSet={myColorSet}
          stringSet={myStringSet}
          uikitOptions={{
            groupChannel: {
              // Below controls the toggling of the typing indicator in the group channel. The default is `true`.
              enableTypingIndicator: true,

              // Below turns on both bubble and text typing indicators. Default is `Text` only.
              typingIndicatorTypes: new Set([
                TypingIndicatorType.Bubble,
                TypingIndicatorType.Text,
              ]),
            },
          }}
        >
          <BrowserRouter>
            <div className={`${isAuthenticated ? classes.app : ""}`}>
              {isAuthenticated && <LeftMenu isMobile={isMobile} />}
              {/* Conditional rendering based on authentication status */}
              {publicPages.includes(window.location.pathname) ? (
                <RoutesComponent />
              ) : (
                <>
                  <SignedIn>
                    {authError ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ErrorPage />
                      </div>
                    ) : (
                      <RoutesComponent />
                    )}
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              )}
            </div>
          </BrowserRouter>
        </SendbirdProvider>
      </ToggleColorMode>
    </ThemeProvider>
  );
};

export default App;
