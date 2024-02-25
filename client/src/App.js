import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
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
import LeftMenu from "./components/LeftMenu";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { setUnreadMessagesCount } from "./redux/actions/messageActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { getUnreadMessagesCount } from "./api/messagingAPI";
import { useSelector } from "react-redux";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ToggleColorMode from "./components/ToggleColorMode";
import "./App.css";
import { ClerkProvider } from "@clerk/clerk-react";
import ClerkCustomSignIn from "./sign-in/[[...index]]";
import ClerkCustomSignUp from "./sign-up/[[...index]]";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    height: "100vh",
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Check if loggedUser.user.id exists before fetching data
    if (loggedUser.user.id) {
      // Fetch unread conversations count and update Redux state
      getUnreadMessagesCount(loggedUser.user.id)
        .then((data) => {
          dispatch(setUnreadMessagesCount(Number(data.unread_count)));
        })
        .catch((error) => {
          console.error("Error fetching unread messages count:", error);
        });

      // Fetch unread notifications count and update Redux state
      getUnreadNotificationsCount(loggedUser.user.id)
        .then((data) => {
          dispatch(updateUnreadNotificationsCount(Number(data.unreadCount)));
        })
        .catch((error) => {
          console.error("Error fetching unread notifications count:", error);
        });
    }
  }, [dispatch, loggedUser.user.id]);

  const RoutesComponent = () => {
    return (
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
  };

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider theme={theme}>
        <ToggleColorMode>
          <BrowserRouter>
            <div className={`${loggedUser.user.id ? classes.app : ""}`}>
              {loggedUser.user.id && <LeftMenu isMobile={isMobile} />}
              <RoutesComponent />
            </div>
          </BrowserRouter>
        </ToggleColorMode>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
