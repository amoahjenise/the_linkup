import React, { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FilterBar from "../components/FilterBar";
import EditLinkupModal from "../components/EditLinkupModal";
import LinkupHistoryItem from "../components/LinkupHistoryItem";
import LinkupRequestItem from "../components/LinkupRequestItem";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { getUserLinkups } from "../api/linkupAPI";
import { getSentRequests, getReceivedRequests } from "../api/linkupRequestAPI";
import LoadingSpinner from "../components/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  linkupHistoryPage: {
    display: "flex",
    width: "100%",
  },
  historySection: {
    flex: "2",
    overflowY: "auto",
    overflowX: "hidden",
    backgroundColor: theme.palette.background.default,
    marginLeft: "auto",
    marginRight: "auto",
  },
  tabBar: {
    borderBottom: "1px solid lightgrey",
  },
}));

const LinkupHistoryPage = ({ isMobile }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const myLinkupsFiltersInitialState = {
    activeStatus: "Active",
    dateFilter: "All",
  };

  const requestsFiltersInitialState = {
    activeStatus: "Pending",
    dateFilter: "All",
  };

  const [myLinkupsFilters, setMyLinkupsFilters] = useState(
    myLinkupsFiltersInitialState
  );

  const [requestsFilters, setRequestsFilters] = useState(
    requestsFiltersInitialState
  );

  const statusOptions = ["Active", "Completed", "Expired", "All"];
  const requestsStatusOptions = ["All", "Pending", "Accepted", "Declined"];

  const tabs = [
    {
      id: 0,
      label: "My Link-Ups",
    },
    { id: 1, label: "Requests Sent" },
    { id: 2, label: "Requests Received" },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLinkupEdit = (linkup) => {
    setIsEditing(!!linkup);
    dispatch(setEditingLinkup(linkup, !!linkup));
  };

  const updateFilters = (newFilters, isMyLinkups) => {
    if (isMyLinkups) {
      setMyLinkupsFilters({ ...myLinkupsFilters, ...newFilters });
    } else {
      setRequestsFilters({ ...requestsFilters, ...newFilters });
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

  // ...

  useEffect(() => {
    // Create a filtered array based on the filter criteria
    if (activeTab === 0) {
      // My Link-Ups
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
      setLinkups({ ...linkups, filteredList: filteredLinkups });
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
          requestsFilters.activeStatus === "All" ||
          request.status.toLowerCase() ===
            requestsFilters.activeStatus.toLowerCase()
        ) {
          // Check if the date filter matches
          if (
            requestsFilters.dateFilter === "All" ||
            (requestsFilters.dateFilter === "Today" &&
              createdAt.getDate() === today.getDate() &&
              createdAt.getMonth() === today.getMonth() &&
              createdAt.getFullYear() === today.getFullYear()) ||
            (requestsFilters.dateFilter === "Last 7 days" &&
              createdAt >= sevenDaysAgo) ||
            (requestsFilters.dateFilter === "Last 30 days" &&
              createdAt >= thirtyDaysAgo)
          ) {
            return true;
          }
        }
        return false;
      });
      setSentRequests({ ...sentRequests, filteredList: filteredSentRequests });
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
            requestsFilters.activeStatus === "All" ||
            request.status.toLowerCase() ===
              requestsFilters.activeStatus.toLowerCase()
          ) {
            // Check if the date filter matches
            if (
              requestsFilters.dateFilter === "All" ||
              (requestsFilters.dateFilter === "Today" &&
                createdAt.getDate() === today.getDate() &&
                createdAt.getMonth() === today.getMonth() &&
                createdAt.getFullYear() === today.getFullYear()) ||
              (requestsFilters.dateFilter === "Last 7 days" &&
                createdAt >= sevenDaysAgo) ||
              (requestsFilters.dateFilter === "Last 30 days" &&
                createdAt >= thirtyDaysAgo)
            ) {
              return true;
            }
          }
          return false;
        }
      );
      setReceivedRequests({
        ...receivedRequests,
        filteredList: filteredReceivedRequests,
      });
    }
  }, [
    activeTab,
    myLinkupsFilters,
    requestsFilters,
    linkups.list,
    sentRequests.list,
    receivedRequests.list,
  ]);

  return (
    <div className={classes.linkupHistoryPage}>
      <div className={classes.historySection}>
        <TopNavBar title="Link Ups" />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Tabs
              className={classes.tabBar}
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              indicatorColor="primary"
              textColor="primary"
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={
                    tab.id === 0
                      ? `My Link-Ups (${linkups.filteredList.length})`
                      : tab.id === 1
                      ? `Sent Requests (${sentRequests.filteredList.length})`
                      : `Received Requests (${receivedRequests.filteredList.length})`
                  }
                  style={{ width: "33%" }}
                />
              ))}
            </Tabs>
            {activeTab === 0 && (
              <div>
                {linkups.filteredList.map((linkup) => (
                  <LinkupHistoryItem
                    key={linkup.id}
                    linkup={linkup}
                    onEdit={() => {
                      handleLinkupEdit(linkup);
                      setIsEditModalOpen(true);
                    }}
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
      </div>
      <FilterBar
        activeTab={activeTab}
        activeStatus={
          activeTab === 0
            ? myLinkupsFilters.activeStatus
            : activeTab === 1
            ? requestsFilters.activeStatus
            : requestsFilters.activeStatus // Handle the third tab's activeStatus similarly
        }
        onStatusChange={(newStatus) => {
          if (activeTab === 0) {
            updateFilters({ activeStatus: newStatus }, true);
          } else {
            updateFilters({ activeStatus: newStatus }, false);
          }
        }}
        dateFilter={
          activeTab === 0
            ? myLinkupsFilters.dateFilter
            : activeTab === 1
            ? requestsFilters.dateFilter
            : requestsFilters.dateFilter
        }
        onDateFilterChange={(newDateFilter) => {
          if (activeTab === 0) {
            updateFilters({ dateFilter: newDateFilter }, true);
          } else {
            updateFilters({ dateFilter: newDateFilter }, false);
          }
        }}
        statusOptions={activeTab === 0 ? statusOptions : requestsStatusOptions}
      />

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
    </div>
  );
};

export default LinkupHistoryPage;
