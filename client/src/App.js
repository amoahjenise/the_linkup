import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import SendRequestPage from "./pages/SendRequestPage";
import MessagesPage from "./pages/MessagesPage";
import LinkupHistoryPage from "./pages/LinkupHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AcceptDeclinePage from "./pages/AcceptDeclinePage";
import SelectedMessagePage from "./pages/SelectedMessagePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsTestPage from "./__tests__/componentTests/NotificationTestPage";
import LeftMenu from "./components/LeftMenu";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { useSelector } from "react-redux";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ToggleColorMode from "./components/ToggleColorMode";
import "./App.css";

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
  const authState = useSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const PrivateRoutes = ({ path, element }) => {
    return isAuthenticated ? (
      <div className={classes.app}>
        <LeftMenu isMobile={isMobile} />
        <Outlet />
      </div>
    ) : (
      <Navigate to="/" />
    );
  };

  useEffect(() => {
    // Fetch unread notifications count and update Redux state
    getUnreadNotificationsCount(loggedUser.user.id)
      .then((data) => {
        dispatch(updateUnreadNotificationsCount(Number(data.unreadCount)));
      })
      .catch((error) => {
        console.error("Error fetching unread notifications count:", error);
      });
  }, [dispatch, loggedUser.user.id]);

  return (
    <ThemeProvider theme={theme}>
      {/* <SocketProvider isAuthenticated={isAuthenticated}> */}
      <div>
        <ToggleColorMode />
        <Router>
          <Routes>
            <Route
              path="/"
              exact
              element={<LandingPage isMobile={isMobile} />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Protected routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<HomePage isMobile={isMobile} />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/profile/:id"
                element={<UserProfilePage isMobile={isMobile} />}
              />
              <Route
                path="/send-request/:linkupId"
                element={<SendRequestPage />}
              />
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
                element={<MessagesPage isMobile={isMobile} />}
              />
              <Route
                path="/messages/:messageid/chat"
                element={<SelectedMessagePage />}
              />
              <Route
                path="/linkup-request/:id"
                element={<AcceptDeclinePage />}
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route
              path="/test-notifications"
              element={<NotificationsTestPage />}
            />
          </Routes>
        </Router>
      </div>
      {/* </SocketProvider> */}
    </ThemeProvider>
  );
};

export default App;
