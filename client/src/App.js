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
} from "./pages";
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
// import useLocationUpdate from "./utils/useLocationUpdate";
import Geolocation from "./components/Geolocation";

const publicPages = [
  "/",
  "/sign-in",
  "/sign-up",
  "/terms-of-service",
  "/privacy-policy",
  "/cookie-use",
];

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    height: "100vh",
  },
}));

const RoutesComponent = ({ isMobile, locationState, userState }) => (
  <Routes>
    <Route path="/" exact element={<LandingPage />} />
    <Route path="/sign-in/*" element={<ClerkCustomSignIn />} />
    <Route path="/sign-up/*" element={<ClerkCustomSignUp />} />
    <Route path="/registration" element={<SignupPage />} />
    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/cookie-use" element={<CookieUsePage />} />
    <Route
      path="/home"
      element={
        locationState.allow_location &&
        locationState.city &&
        locationState.country ? (
          <HomePage isMobile={isMobile} />
        ) : locationState ? (
          <Geolocation />
        ) : (
          <></>
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
  </Routes>
);

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);
  const { isRegistering } = useSelector((state) => state.registration);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSigningOut } = useSelector((state) => state.logout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useUser();
  const [authError, setAuthError] = useState(false);
  const { colorMode } = useColorMode();
  // const { updateLocation } = useLocationUpdate();

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
    "--sendbird-dark-background-600": "#1f2733",
    "--sendbird-dark-background-700": "#1b2330",
  };

  const myStringSet = {
    MESSAGE_INPUT__PLACE_HOLDER__DISABLED:
      "This chat is temporarily disabled until the recipient responds or accepts the request.",
  };

  const REACT_APP_SENDBIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || isSigningOut || !user?.id || isRegistering) return;
      try {
        const result = await authenticateUser(user.id);
        if (result.success) {
          console.log("App.js Fetch Data executed", isRegistering);
          dispatch(setCurrentUser(result.user));
          // updateLocation(true);
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
      // if (!user || !isAuthenticated) return;
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
        console.error("Error during user data fetch:", error);
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
      <ToggleColorMode>
        <SendbirdProvider
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
            <div className={`${isAuthenticated ? classes.app : ""}`}>
              {isAuthenticated && !isRegistering && (
                <LeftMenu isMobile={isMobile} />
              )}
              {publicPages.includes(window.location.pathname) ? (
                <RoutesComponent
                  isMobile={isMobile}
                  locationState={locationState}
                  userState={userState}
                />
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
                      <RoutesComponent
                        isMobile={isMobile}
                        locationState={locationState}
                      />
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
