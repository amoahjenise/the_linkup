import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { setUnreadMessagesCount } from "./redux/actions/messageActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { getUnreadMessagesCount } from "./api/messagingAPI";
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
import ErrorPage from "./pages/ErrorPage";
import LeftMenu from "./components/LeftMenu";
import ToggleColorMode from "./components/ToggleColorMode";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { authenticateUser } from "./api/authenticationAPI";
import { setCurrentUser } from "./redux/actions/userActions";
import { login } from "./redux/actions/authActions";
import { useUser } from "@clerk/clerk-react";

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
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSigningOut } = useSelector((state) => state.logout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useUser();
  const [authError, setAuthError] = useState(false);

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
  }, []);

  const RoutesComponent = () => (
    <Routes>
      <Route path="/" exact element={<LandingPage isMobile={isMobile} />} />
      <Route path="/sign-in/*" element={<ClerkCustomSignIn />} />
      <Route path="/sign-up/*" element={<ClerkCustomSignUp />} />
      <Route path="/registration" element={<SignupPage />} />
      <Route path="/home" element={<HomePage isMobile={isMobile} />} />
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
      </ToggleColorMode>
    </ThemeProvider>
  );
};

export default App;
