import React, { useEffect, useState, useCallback, useMemo } from "react";
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

const App = () => {
  const dispatch = useDispatch();
  const { isSignedIn } = useSession();
  const { user } = useUser();
  const { colorMode } = useColorMode();
  const { updateBadge } = useBadge();

  // Memoized selectors
  const userState = useSelector((state) => state.loggedUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isSigningOut = useSelector((state) => state.logout.isSigningOut);
  const isRegistering = useSelector(
    (state) => state.registration.isRegistering
  );

  const theme = useMemo(() => createTheme(), []);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [authError, setAuthError] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const myColorSet = useMemo(
    () => ({
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
      "--sendbird-dark-background-600": "black",
      "--sendbird-dark-background-700": "#1b2330",
      "--sendbird-light-onlight-04": "#cbcbcb",
      "--sendbird-dark-ondark-04": "#e6e6e6",
    }),
    []
  );

  const myStringSet = useMemo(
    () => ({
      MESSAGE_INPUT__PLACE_HOLDER__DISABLED: "Disabled - awaiting reply.",
    }),
    []
  );

  const REACT_APP_SENDBIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  if ("windowControlsOverlay" in navigator) {
    navigator.windowControlsOverlay.addEventListener(
      "geometrychange",
      debounce((e) => {
        const isOverlayVisible = navigator.windowControlsOverlay.visible;
        const titleBarRect = e.titlebarAreaRect;
        console.log(
          `The overlay is ${
            isOverlayVisible ? "visible" : "hidden"
          }, the title bar width is ${titleBarRect.width}px`
        );
      }, 200)
    );
  }

  // Device detection
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
  }, []);

  // PWA installation handling
  const handleInstallClick = useCallback(() => {
    if (isIOS) {
      alert(`To install this app:
1. Tap the Share icon (📤)
2. Select "Add to Home Screen"
3. Tap "Add" in the top right`);
      return;
    }

    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsAppInstalled(true);
        }
        setInstallPromptEvent(null);
      });
    }
  }, [installPromptEvent, isIOS]);

  // PWA installation detection
  useEffect(() => {
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isIOSStandalone = window.navigator.standalone;
      const isLaunchedFromHomeScreen = isStandalone || isIOSStandalone;
      setIsAppInstalled(isLaunchedFromHomeScreen);
    };

    checkPWAStatus();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const listener = () => checkPWAStatus();
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // BeforeInstallPrompt event listener
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Badge management
  const updateAllBadges = useCallback(async () => {
    if (!userState?.user?.id) return;

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
  }, [userState?.user?.id, dispatch, updateBadge]);

  useEffect(() => {
    updateAllBadges();
    const interval = setInterval(updateAllBadges, 300000);
    return () => clearInterval(interval);
  }, [updateAllBadges]);

  // Online status management
  const handleOnlineStatus = useCallback(
    async (isOnline) => {
      if (isSignedIn && userState?.user?.id) {
        await storeUserOnlineStatus(userState.user.id, isOnline);
      }
    },
    [isSignedIn, userState?.user?.id]
  );

  useEffect(() => {
    handleOnlineStatus(true);
    return () => {
      handleOnlineStatus(false);
    };
  }, [handleOnlineStatus]);

  // Authentication
  const authenticate = useCallback(async () => {
    if (!user || isSigningOut || !user?.id || isRegistering) return;

    try {
      const result = await authenticateUser(user.id);
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
  }, [user, isSigningOut, isRegistering, dispatch]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  // Fetch unread counts
  const fetchUnreadCounts = useCallback(async () => {
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
  }, [
    user,
    isAuthenticated,
    isSigningOut,
    isRegistering,
    userState?.user?.id,
    dispatch,
  ]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  // Routes component
  const RoutesComponent = useMemo(
    () => (
      <Routes>
        <Route
          path="/"
          exact
          element={
            <LandingPage
              showInstallButton={!isAppInstalled}
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
        <Route
          path="/settings"
          element={<SettingsPage isMobile={isMobile} />}
        />
        <Route path="/Error" element={<ErrorPage />} />
        <Route path="/pricing" element={<PricingPage isMobile={isMobile} />} />
      </Routes>
    ),
    [isMobile, isAppInstalled, handleInstallClick]
  );

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
              RoutesComponent
            ) : (
              <>
                <SignedIn>
                  {authError ? <ErrorPage /> : RoutesComponent}
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
