import React, { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import TopNavBar from "../components/TopNavBar";
import { Tab, Tabs } from "@mui/material";
import FilterBar from "../components/FilterBar";
import EditLinkupModal from "../components/EditLinkupModal";
import LinkupHistoryItem from "../components/LinkupHistoryItem";
import LinkupRequestItem from "../components/LinkupRequestItem";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { getUserLinkups } from "../api/linkUpAPI";
import { getSentRequests, getReceivedRequests } from "../api/linkupRequestAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import { useColorMode } from "@chakra-ui/react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const PREFIX = "HistoryPage";
const classes = {
  widgetSection: `${PREFIX}-widgetSection`,
  widgetButton: `${PREFIX}-widgetButton`,
  widgetCloseButton: `${PREFIX}-widgetCloseButton`,
  slideIn: `${PREFIX}-slideIn`,
  slideOut: `${PREFIX}-slideOut`,
};

const StyledDiv = styled("div")(({ theme, colorMode }) => ({
  [`&.${classes.widgetSection}`]: {
    flex: "1",
    overflowY: "auto",
    overflowX: "hidden",
    display: "block", // Make sure it's displayed by default
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "#1A202C" : "white", // Use Chakra's dark mode color
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      overflowY: "auto",
    },
  },
  [`&.${classes.widgetButton}`]: {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 1100,
  },
  [`&.${classes.widgetCloseButton}`]: {
    position: "absolute",
    top: "10px",
    left: "10px", // Position close button on the right side
    zIndex: 1100,
    color: colorMode === "dark" ? "white" : "black", // Adjust color based on mode
  },
  [`&.${classes.slideIn}`]: {
    transform: "translateX(0)",
  },
  [`&.${classes.slideOut}`]: {
    transform: "translateX(100%)",
  },
}));

// Styled components
const LinkupHistoryPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
}));

const HistorySection = styled("div")(({ theme, isFilterBarOpen }) => ({
  flex: 2,
  overflowY: "auto",
  overflowX: "hidden",
  margin: "0 auto",
  transition: "transform 0.3s ease",
  transform: isFilterBarOpen ? "translateX(-300px)" : "translateX(0)", // Adjust based on FilterBar width
  width: "100%", // Full width when FilterBar is hidden
}));

const FilterBarContainer = styled("div")(
  ({ theme, isFilterBarOpen, isMobile }) => ({
    flex: "1",
    overflowY: "auto",
    overflowX: "hidden",
    display: "block", // Make sure it's displayed by default
    borderLeft: "1px solid #D3D3D3",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      // backgroundColor: colorMode === "dark" ? "#1A202C" : "white", // Use Chakra's dark mode color
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      overflowY: "auto",
    },
  })
);

const TopBarContainer = styled("div")(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

const TabBar = styled(Tabs)(({ theme }) => ({
  borderBottomWidth: "1px",
  borderBottomColor: "1px solid #D3D3D3",
  position: "sticky", // Make the tabs bar sticky
  top: 65, // Stick it bellow the top bar
  zIndex: 1, // Ensure it's above other content
}));

const LinkUpHistoryPage = ({ isMobile }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const [isLoading, setIsLoading] = useState(true);

  const [linkups, setLinkups] = useState({
    list: [],
    filteredList: [],
  });

  const [sentRequests, setSentRequests] = useState({
    list: [],
    filteredList: [],
  });

  const [receivedRequests, setReceivedRequests] = useState({
    list: [],
    filteredList: [],
  });

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const myLinkupsFiltersInitialState = {
    activeStatus: "Active",
    dateFilter: "All",
  };

  const [myLinkupsFilters, setMyLinkupsFilters] = useState(
    myLinkupsFiltersInitialState
  );

  const [sentRequestsFilters, setSentRequestsFilters] = useState({
    activeStatus: "All",
    dateFilter: "All",
  });

  const [receivedRequestsFilters, setReceivedRequestsFilters] = useState({
    activeStatus: "All",
    dateFilter: "All",
  });

  const statusOptions = ["Active", "Closed", "Completed", "Expired", "All"];
  const requestsStatusOptions = [
    "All",
    "Pending",
    "Accepted",
    "Declined",
    "Expired",
  ];

  const tabs = [
    {
      id: 0,
      label: "My Linkups",
    },
    { id: 1, label: "Requests Sent" },
    { id: 2, label: "Requests Received" },
  ];

  const color =
    colorMode === "dark"
      ? "white" // Dark mode text color white
      : "black"; // Light mode text color black

  const backgroundColor =
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.99)" // Dark mode background color with 90% transparency
      : "rgba(255, 255, 255, 0.99)"; // Light mode background color

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLinkupEdit = (linkup) => {
    setIsEditing(!!linkup);
    dispatch(setEditingLinkup(linkup));
  };

  const updateFilters = (newFilters, isMyLinkups) => {
    if (isMyLinkups) {
      setMyLinkupsFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    } else if (activeTab === 1) {
      // Requests Sent
      setSentRequestsFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    } else if (activeTab === 2) {
      // Requests Received
      setReceivedRequestsFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    }
  };

  const fetchLinkups = useCallback(async () => {
    try {
      const userLinkupsResponse = await getUserLinkups(userId);
      if (userLinkupsResponse.success) {
        setLinkups({
          list: userLinkupsResponse.linkupList,
          filteredList: userLinkupsResponse.linkupList,
        });
      } else {
        console.error("Error fetching linkups:", userLinkupsResponse.message);
      }

      const sentRequestsResponse = await getSentRequests(userId);
      if (sentRequestsResponse.success) {
        setSentRequests({
          list: sentRequestsResponse.linkupRequestList,
          filteredList: sentRequestsResponse.linkupRequestList,
        });
      } else {
        console.error(
          "Error fetching linkup requests:",
          sentRequestsResponse.message
        );
      }

      const receivedRequestsResponse = await getReceivedRequests(userId);
      if (receivedRequestsResponse.success) {
        setReceivedRequests({
          list: receivedRequestsResponse.linkupRequestList,
          filteredList: receivedRequestsResponse.linkupRequestList,
        });
      } else {
        console.error(
          "Error fetching linkup requests:",
          receivedRequestsResponse.message
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [userId]);

  useEffect(() => {
    switch (location.pathname) {
      case "/history":
        setActiveTab(0);
        break;
      case "/history/requests-sent":
        setActiveTab(1);
        break;
      case "/history/requests-received":
        setActiveTab(2);
        break;
      default:
        setActiveTab(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkups, shouldFetchLinkups]);

  useEffect(() => {
    // Create a filtered array based on the filter criteria
    if (activeTab === 0) {
      // My Linkups
      const filteredLinkups = linkups.list.filter((linkup) => {
        const createdAt = new Date(linkup.created_at);
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return (
          (myLinkupsFilters.activeStatus === "All" ||
            linkup.status.toLowerCase() ===
              myLinkupsFilters.activeStatus.toLowerCase()) &&
          (myLinkupsFilters.dateFilter === "All" ||
            (myLinkupsFilters.dateFilter === "Today" &&
              createdAt.getDate() === today.getDate() &&
              createdAt.getMonth() === today.getMonth() &&
              createdAt.getFullYear() === today.getFullYear()) ||
            (myLinkupsFilters.dateFilter === "Last 7 days" &&
              createdAt >= sevenDaysAgo) ||
            (myLinkupsFilters.dateFilter === "Last 30 days" &&
              createdAt >= thirtyDaysAgo))
        );
      });

      // Update the filteredLinkupList state with the filtered array
      setLinkups((prevLinkups) => ({
        ...prevLinkups,
        filteredList: filteredLinkups,
      }));
    } else if (activeTab === 1) {
      // Requests Sent
      const filteredSentRequests = sentRequests.list.filter((request) => {
        const createdAt = new Date(request.created_at);
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Check if the request status matches the selected status filter
        if (
          sentRequestsFilters.activeStatus === "All" ||
          request.status.toLowerCase() ===
            sentRequestsFilters.activeStatus.toLowerCase()
        ) {
          // Check if the date filter matches
          if (
            sentRequestsFilters.dateFilter === "All" ||
            (sentRequestsFilters.dateFilter === "Today" &&
              createdAt.getDate() === today.getDate() &&
              createdAt.getMonth() === today.getMonth() &&
              createdAt.getFullYear() === today.getFullYear()) ||
            (sentRequestsFilters.dateFilter === "Last 7 days" &&
              createdAt >= sevenDaysAgo) ||
            (sentRequestsFilters.dateFilter === "Last 30 days" &&
              createdAt >= thirtyDaysAgo)
          ) {
            return true;
          }
        }
        return false;
      });
      setSentRequests((prevSentRequests) => ({
        ...prevSentRequests,
        filteredList: filteredSentRequests,
      }));
    } else if (activeTab === 2) {
      // Requests Received
      const filteredReceivedRequests = receivedRequests.list.filter(
        (request) => {
          const createdAt = new Date(request.created_at);
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);

          // Check if the request status matches the selected status filter
          if (
            receivedRequestsFilters.activeStatus === "All" ||
            request.status.toLowerCase() ===
              receivedRequestsFilters.activeStatus.toLowerCase()
          ) {
            // Check if the date filter matches
            if (
              receivedRequestsFilters.dateFilter === "All" ||
              (receivedRequestsFilters.dateFilter === "Today" &&
                createdAt.getDate() === today.getDate() &&
                createdAt.getMonth() === today.getMonth() &&
                createdAt.getFullYear() === today.getFullYear()) ||
              (receivedRequestsFilters.dateFilter === "Last 7 days" &&
                createdAt >= sevenDaysAgo) ||
              (receivedRequestsFilters.dateFilter === "Last 30 days" &&
                createdAt >= thirtyDaysAgo)
            ) {
              return true;
            }
          }
          return false;
        }
      );
      setReceivedRequests((prevReceivedRequests) => ({
        ...prevReceivedRequests,
        filteredList: filteredReceivedRequests,
      }));
    }
  }, [
    activeTab,
    myLinkupsFilters,
    sentRequestsFilters,
    receivedRequestsFilters,
    linkups.list,
    sentRequests.list,
    receivedRequests.list,
  ]);

  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <LinkupHistoryPageContainer>
      <HistorySection>
        <TopBarContainer>
          <TopNavBar title="Linkups" />
        </TopBarContainer>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TabBar
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              indicatorColor="primary"
              style={{
                width: "100%", // Ensure Tabs take full width
                backgroundColor,
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={
                    tab.id === 0
                      ? `My Linkups (${linkups.filteredList.length})`
                      : tab.id === 1
                      ? `Sent Requests (${sentRequests.filteredList.length})`
                      : `Received Requests (${receivedRequests.filteredList.length})`
                  }
                  style={{
                    width: "33%",
                    color, // Apply the color directly to each Tab
                  }}
                />
              ))}
            </TabBar>

            {activeTab === 0 && (
              <div>
                {linkups.filteredList.map((linkup) => (
                  <LinkupHistoryItem
                    key={linkup.id}
                    linkup={linkup}
                    setShouldFetchLinkups={setShouldFetchLinkups}
                  />
                ))}
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div>
                  {sentRequests.filteredList.map((request) => (
                    <LinkupRequestItem
                      key={request.id}
                      post={request}
                      setShouldFetchLinkups={setShouldFetchLinkups}
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <div>
                  {receivedRequests.filteredList.map((request) => (
                    <LinkupRequestItem
                      key={request.id}
                      post={request}
                      setShouldFetchLinkups={setShouldFetchLinkups}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </HistorySection>
      <FilterBarContainer>
        {!isMobile && (
          <StyledDiv className={classes.widgetSection} colorMode={colorMode}>
            <FilterBar
              isMobile={isMobile}
              activeTab={activeTab}
              activeStatus={
                activeTab === 0
                  ? myLinkupsFilters.activeStatus
                  : activeTab === 1
                  ? sentRequestsFilters.activeStatus
                  : receivedRequestsFilters.activeStatus
              }
              onStatusChange={(newStatus) => {
                if (activeTab === 0) {
                  updateFilters({ activeStatus: newStatus }, true);
                } else if (activeTab === 1) {
                  setSentRequestsFilters((prevFilters) => ({
                    ...prevFilters,
                    activeStatus: newStatus,
                  }));
                } else {
                  setReceivedRequestsFilters((prevFilters) => ({
                    ...prevFilters,
                    activeStatus: newStatus,
                  }));
                }
              }}
              dateFilter={
                activeTab === 0
                  ? myLinkupsFilters.dateFilter
                  : activeTab === 1
                  ? sentRequestsFilters.dateFilter
                  : receivedRequestsFilters.dateFilter
              }
              onDateFilterChange={(newDateFilter) => {
                if (activeTab === 0) {
                  updateFilters({ dateFilter: newDateFilter }, true);
                } else if (activeTab === 1) {
                  setSentRequestsFilters((prevFilters) => ({
                    ...prevFilters,
                    dateFilter: newDateFilter,
                  }));
                } else {
                  setReceivedRequestsFilters((prevFilters) => ({
                    ...prevFilters,
                    dateFilter: newDateFilter,
                  }));
                }
              }}
              statusOptions={
                activeTab === 0 ? statusOptions : requestsStatusOptions
              }
            />
          </StyledDiv>
        )}
        {isMobile && (
          <>
            <IconButton
              className={classes.widgetButton}
              onClick={toggleWidget}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <StyledDiv
              className={`${classes.widgetSection} ${
                isWidgetVisible ? classes.slideIn : classes.slideOut
              }`}
              colorMode={colorMode}
            >
              <IconButton
                className={classes.widgetCloseButton}
                onClick={toggleWidget}
              >
                <CloseIcon />
              </IconButton>
              <FilterBar
                isMobile={isMobile}
                activeTab={activeTab}
                activeStatus={
                  activeTab === 0
                    ? myLinkupsFilters.activeStatus
                    : activeTab === 1
                    ? sentRequestsFilters.activeStatus
                    : receivedRequestsFilters.activeStatus
                }
                onStatusChange={(newStatus) => {
                  if (activeTab === 0) {
                    updateFilters({ activeStatus: newStatus }, true);
                  } else if (activeTab === 1) {
                    setSentRequestsFilters((prevFilters) => ({
                      ...prevFilters,
                      activeStatus: newStatus,
                    }));
                  } else {
                    setReceivedRequestsFilters((prevFilters) => ({
                      ...prevFilters,
                      activeStatus: newStatus,
                    }));
                  }
                }}
                dateFilter={
                  activeTab === 0
                    ? myLinkupsFilters.dateFilter
                    : activeTab === 1
                    ? sentRequestsFilters.dateFilter
                    : receivedRequestsFilters.dateFilter
                }
                onDateFilterChange={(newDateFilter) => {
                  if (activeTab === 0) {
                    updateFilters({ dateFilter: newDateFilter }, true);
                  } else if (activeTab === 1) {
                    setSentRequestsFilters((prevFilters) => ({
                      ...prevFilters,
                      dateFilter: newDateFilter,
                    }));
                  } else {
                    setReceivedRequestsFilters((prevFilters) => ({
                      ...prevFilters,
                      dateFilter: newDateFilter,
                    }));
                  }
                }}
                statusOptions={
                  activeTab === 0 ? statusOptions : requestsStatusOptions
                }
              />
            </StyledDiv>
          </>
        )}
      </FilterBarContainer>
      {isEditing && (
        <EditLinkupModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            handleLinkupEdit(null);
          }}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
      )}
    </LinkupHistoryPageContainer>
  );
};

export default LinkUpHistoryPage;
