import React from "react";
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
import NewsFeedPage from "./pages/NewsFeedPage";
import UserProfilePage from "./pages/UserProfilePage";
import SendRequestPage from "./pages/SendRequestPage";
import MessagesPage from "./pages/MessagesPage";
import LinkUpHistoryPage from "./pages/LinkUpHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AcceptDeclinePage from "./pages/AcceptDeclinePage";
import SelectedMessagePage from "./pages/SelectedMessagePage";
import { useSelector } from "react-redux";
import "./App.css";

const App = () => {
  const authState = useSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;

  const PrivateRoutes = ({ path, element }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<NewsFeedPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/send-request/:postId" element={<SendRequestPage />} />
            <Route path="/history" element={<LinkUpHistoryPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route
              path="/messages/:messageid/chat"
              element={<SelectedMessagePage />}
            />
            <Route path="/linkup-request/:id" element={<AcceptDeclinePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
