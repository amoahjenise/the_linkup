import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
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
import LinkUpHistoryPage from "./pages/LinkUpHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AcceptDeclinePage from "./pages/AcceptDeclinePage";
import SelectedMessagePage from "./pages/SelectedMessagePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsTestPage from "./__tests__/componentTests/NotificationTestPage";
import LeftMenu from "./components/LeftMenu";
import { updateUnreadNotificationsCount } from "./redux/actions/notificationActions";
import { getUnreadNotificationsCount } from "./api/notificationAPI";
import { useSelector } from "react-redux";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
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
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );
  const authState = useSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const [activeSection, setActiveSection] = useState("home"); // Manage active section here
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const PrivateRoutes = ({ path, element }) => {
    return isAuthenticated ? (
      <div className={classes.app}>
        <LeftMenu
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Outlet />
      </div>
    ) : (
      <Navigate to="/login" />
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

  useEffect(() => {
    const socket = io(process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL);

    socket.on("connect", () => {
      console.log("Client Connected to notification WebSocket server");

      // Emit the user's ID to store the socket connection
      socket.emit("store-user-id", loggedUser.user?.id);
    });

    socket.on("notification", (notification) => {
      console.log("Received notification", notification);
      // Handle the incoming notification and update UI
      dispatch(updateUnreadNotificationsCount(unreadNotificationsCount + 1));
      alert(`Received notification: ${notification.content}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, loggedUser.user?.id, unreadNotificationsCount]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className="app">
          <Router>
            <Routes>
              <Route path="/" exact element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Protected routes */}
              <Route element={<PrivateRoutes />}>
                <Route
                  path="/home"
                  element={<HomePage isMobile={isMobile} />}
                />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile/:id" element={<UserProfilePage />} />
                <Route
                  path="/send-request/:linkupId"
                  element={<SendRequestPage />}
                />
                <Route
                  path="/history"
                  element={<LinkUpHistoryPage isMobile={isMobile} />}
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
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
