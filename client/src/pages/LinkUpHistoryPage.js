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
    display: "block",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "#1A202C" : "white",
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      overflowY: "auto",
    },
  },
  [`&.${classes.widgetButton}`]: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1100,
    backgroundColor: colorMode === "dark" ? "#1A202C" : "white",
    borderRadius: "50%",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
    padding: "10px",
  },
  [`&.${classes.widgetCloseButton}`]: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 1100,
    color: colorMode === "dark" ? "white" : "black",
  },
  [`&.${classes.slideIn}`]: {
    transform: "translateX(0)",
  },
  [`&.${classes.slideOut}`]: {
    transform: "translateX(100%)",
  },
}));
const LinkupHistoryPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
}));

const HistorySection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // alignItems: "center",
  width: "100%",
}));

const FilterBarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  overflowY: "auto",
  borderLeft: "1px solid #D3D3D3",
  padding: theme.spacing(1, 2),
}));

const TopBarContainer = styled("div")(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

const TabBar = styled(Tabs)(({ theme }) => ({
  borderBottomWidth: "1px",
  borderBottomColor: "1px solid #D3D3D3",
  position: "sticky",
  top: 65,
  zIndex: 1,
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
      setSentRequestsFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    } else if (activeTab === 2) {
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
    if (activeTab === 0) {
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
      setLinkups((prevLinkups) => ({
        ...prevLinkups,
        filteredList: filteredLinkups,
      }));
    } else if (activeTab === 1) {
      const filteredSentRequests = sentRequests.list.filter((request) => {
        const createdAt = new Date(request.created_at);
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        if (
          sentRequestsFilters.activeStatus === "All" ||
          request.status.toLowerCase() ===
            sentRequestsFilters.activeStatus.toLowerCase()
        ) {
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
      const filteredReceivedRequests = receivedRequests.list.filter(
        (request) => {
          const createdAt = new Date(request.created_at);
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);

          if (
            receivedRequestsFilters.activeStatus === "All" ||
            request.status.toLowerCase() ===
              receivedRequestsFilters.activeStatus.toLowerCase()
          ) {
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
                {sentRequests.filteredList.map((request) => (
                  <LinkupRequestItem
                    key={request.id}
                    post={request}
                    setShouldFetchLinkups={setShouldFetchLinkups}
                  />
                ))}
              </div>
            )}
            {activeTab === 2 && (
              <div>
                {receivedRequests.filteredList.map((request) => (
                  <LinkupRequestItem
                    key={request.id}
                    post={request}
                    setShouldFetchLinkups={setShouldFetchLinkups}
                  />
                ))}
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
