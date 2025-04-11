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
import { useBadge } from "./utils/badgeUtils";
import PullToRefresh from "react-pull-to-refresh";

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
  }),
}));

const RoutesComponent = ({
  isMobile,
  showInstallButton,
  handleInstallClick,
}) => (
  <Routes>
    <Route
      path="/"
      exact
      element={
        <LandingPage
          showInstallButton={showInstallButton}
          handleInstallClick={handleInstallClick}
        />
      }
    />
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
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { updateBadge } = useBadge();

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
    MESSAGE_INPUT__PLACE_HOLDER__DISABLED: "Disabled - awaiting reply.",
  };

  const REACT_APP_SENDBIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;

  // Detect if the device is mobile
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Enhanced device detection
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // iOS-specific instructions
      alert(`To install this app:
  1. Tap the Share icon (📤)
  2. Select "Add to Home Screen"
  3. Tap "Add" in the top right`);
      return;
    }

    // Standard PWA installation flow
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsAppInstalled(true);
        }
        setInstallPromptEvent(null);
        setShowInstallButton(false);
      });
    } else if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsAppInstalled(true);
        }
        window.deferredPrompt = null;
      });
    } else {
      // Fallback instructions
      if (isAndroid) {
        alert('Please use Chrome\'s menu (⋮) and select "Install App"');
      } else {
        alert("Look for the install option in your browser's menu");
      }
    }
  };

  useEffect(() => {
    // Check PWA installation status
    const checkPWAStatus = () => {
      // More reliable installation detection without getInstalledRelatedApps
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isIOSStandalone = window.navigator.standalone;
      const isLaunchedFromHomeScreen =
        isStandalone ||
        isIOSStandalone ||
        document.referrer.includes("android-app://");

      setIsAppInstalled(isLaunchedFromHomeScreen);
    };

    // Initial check
    checkPWAStatus();

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const listener = () => checkPWAStatus();
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      console.log("BeforeInstallPrompt event caught", e);
      e.preventDefault();

      // Store on window as fallback
      window.deferredPrompt = e;

      // Update state
      setInstallPromptEvent(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Added this effect for global badge management
  useEffect(() => {
    if (!userState?.user?.id) return;

    const updateAllBadges = async () => {
      try {
        const [messagesRes, notificationsRes] = await Promise.all([
          getUnreadMessagesCount(userState.user.id),
          getUnreadNotificationsCount(userState.user.id),
        ]);

        const totalUnread =
          Number(messagesRes.unread_count || 0) +
          Number(notificationsRes.unreadCount || 0);

        dispatch(setUnreadMessagesCount(Number(messagesRes.unread_count)));
        dispatch(
          updateUnreadNotificationsCount(Number(notificationsRes.unreadCount))
        );

        await updateBadge(totalUnread);
      } catch (error) {
        console.error("Badge update error:", error);
      }
    };

    // Initial update
    updateAllBadges();

    // Periodic refresh (every 5 minutes)
    const interval = setInterval(updateAllBadges, 300000);

    return () => clearInterval(interval);
  }, [userState?.user?.id, dispatch, updateBadge]);

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
            {isAuthenticated && !isRegistering && (
              <LeftMenu isMobile={isMobile} />
            )}
            {publicPages.includes(window.location.pathname) ? (
              <RoutesComponent
                isMobile={isMobile}
                showInstallButton={!isAppInstalled} // Only show if not installed
                handleInstallClick={handleInstallClick}
              />
            ) : (
              <>
                <SignedIn>
                  {authError ? (
                    <ErrorPage />
                  ) : (
                    <RoutesComponent
                      isMobile={isMobile}
                      showInstallButton={!isAppInstalled} // Only show if not installed
                      handleInstallClick={handleInstallClick}
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
