import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { debounce } from "lodash";
import WidgetSection from "../components/WidgetSection";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import useLocationUpdate from "../hooks/useLocationUpdate";
import LinkupFeed from "../components/LinkupFeed";

const StyledDiv = styled("div")(({ theme, colorMode }) => ({
  [`&.homePage`]: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  [`&.feedSection`]: {
    flex: "2.5",
    overflowY: "auto",
    borderRight: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
    [theme.breakpoints.down("md")]: {
      flex: "2",
      borderRight:
        window.innerWidth > 600
          ? `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`
          : "none",
    },
    [theme.breakpoints.down("sm")]: {
      flex: "1",
      borderRight: "none",
    },
  },
  [`&.widgetSection`]: {
    flex: "1.5",
    overflowY: "auto",
    borderLeft: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
    [theme.breakpoints.down("md")]: {
      flex: "2",
      borderLeft:
        window.innerWidth > 600
          ? `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`
          : "none",
    },
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "black" : "white",
      boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      borderLeft: "none",
    },
  },
  [`&.widgetSection.slideIn`]: {
    transform: "translateX(0)",
  },
}));

const HomePage = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const feedRef = useRef();
  const wasManuallyToggled = useRef(false);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;

  // State for responsive behavior
  const [state, setState] = useState({
    isWidgetVisible: window.innerWidth > 600,
    isMobileView: window.innerWidth <= 600,
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useLocationUpdate();

  const refreshFeed = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      dispatch(showNewLinkupButton(false));
      if (!userId) return;
      const response = await getLinkupRequests(userId);
      if (response.success) {
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList));
      }
    } catch (error) {
      console.error("Error fetching linkup requests:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  const toggleWidget = useCallback(() => {
    wasManuallyToggled.current = true;
    setState((prev) => ({ ...prev, isWidgetVisible: !prev.isWidgetVisible }));
  }, []);

  // Enhanced responsive handling
  useEffect(() => {
    const handleResize = debounce(() => {
      const newIsMobile = window.innerWidth <= 600;
      setState((prev) => ({
        ...prev,
        isMobileView: newIsMobile,
        isWidgetVisible: wasManuallyToggled.current
          ? prev.isWidgetVisible
          : !newIsMobile,
      }));
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollToTop = useCallback(() => {
    if (feedRef.current?.scrollToTop) {
      feedRef.current.scrollToTop();
    }
  }, []);

  return (
    <StyledDiv className="homePage" colorMode={colorMode}>
      <StyledDiv className="feedSection">
        {userId && (
          <LinkupFeed
            ref={feedRef}
            key={refreshTrigger}
            userId={userId}
            gender={loggedUser.user.gender}
            location={{
              latitude: loggedUser.user.latitude,
              longitude: loggedUser.user.longitude,
            }}
            refreshFeed={refreshFeed}
            colorMode={colorMode}
          />
        )}
      </StyledDiv>

      <StyledDiv
        className={`widgetSection ${state.isWidgetVisible ? "slideIn" : ""}`}
        colorMode={colorMode}
      >
        {state.isMobileView && (
          <IconButton
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1100,
              color: colorMode === "dark" ? "white" : "black",
            }}
            onClick={toggleWidget}
          >
            <CloseIcon />
          </IconButton>
        )}
        <WidgetSection
          toggleWidget={toggleWidget}
          isMobile={state.isMobileView}
          refreshFeed={refreshFeed}
          handleScrollToTop={handleScrollToTop}
        />
      </StyledDiv>

      {state.isMobileView && !state.isWidgetVisible && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: "100px",
            right: "32px",
            zIndex: 1000,
            color: "white",
            backgroundColor: "#0097A7",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            padding: "12px",
            "&:hover": {
              backgroundColor: "#008394",
            },
          }}
          onClick={toggleWidget}
        >
          <AddIcon />
        </IconButton>
      )}
    </StyledDiv>
  );
};

export default HomePage;
