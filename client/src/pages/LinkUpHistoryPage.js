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
import { setIsLoading } from "../redux/actions/linkupActions";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { getUserLinkups } from "../api/linkupAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";

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
  const userID = loggedUser.user.id;

  // Combine related state into single objects
  const [linkups, setLinkups] = useState({
    list: [],
    filteredList: [],
  });

  const [requests, setRequests] = useState({
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
    activeStatus: "All",
    dateFilter: "All",
  };

  const [myLinkupsFilters, setMyLinkupsFilters] = useState(
    myLinkupsFiltersInitialState
  );

  const [requestsFilters, setRequestsFilters] = useState(
    requestsFiltersInitialState
  );

  const statusOptions = ["Active", "Accepted", "Declined", "Expired", "All"];
  const requestsStatusOptions = ["All", "Active", "Accepted", "Declined"];

  const tabs = [
    {
      id: 0,
      label: "My Link-Ups",
    },
    { id: 1, label: "Requests" },
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
    dispatch(setIsLoading(true));

    try {
      const userLinkupsResponse = await getUserLinkups(userID);
      if (userLinkupsResponse.success) {
        setLinkups({
          list: userLinkupsResponse.linkupList,
          filteredList: userLinkupsResponse.linkupList,
        });
      } else {
        console.error("Error fetching linkups:", userLinkupsResponse.message);
      }

      const linkupRequestsResponse = await getLinkupRequests(userID);
      if (linkupRequestsResponse.success) {
        setRequests({
          list: linkupRequestsResponse.linkupRequestList,
          filteredList: linkupRequestsResponse.linkupRequestList,
        });
      } else {
        console.error(
          "Error fetching linkup requests:",
          linkupRequestsResponse.message
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, userID]);

  useEffect(() => {
    switch (location.pathname) {
      case "/history":
        setActiveTab(0);
        break;
      case "/history/requests":
        setActiveTab(1);
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
  }, [linkups.list, myLinkupsFilters]);

  useEffect(() => {
    // Create a filtered array based on the filter criteria
    const filteredRequests = requests.list.filter((request) => {
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

    // Update the filteredRequestList state with the filtered array
    setRequests({ ...requests, filteredList: filteredRequests });
  }, [requests.list, requestsFilters]);

  return (
    <div className={classes.linkupHistoryPage}>
      <div className={classes.historySection}>
        <TopNavBar title="Link Ups" />
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
                  : `Requests (${requests.filteredList.length})`
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
              {requests.filteredList.map((request) => (
                <LinkupRequestItem
                  key={request.id}
                  post={request}
                  setShouldFetchLinkups={setShouldFetchLinkups}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <FilterBar
        activeTab={activeTab}
        activeStatus={
          activeTab === 0
            ? myLinkupsFilters.activeStatus
            : requestsFilters.activeStatus
        }
        onStatusChange={(newStatus) => {
          updateFilters({ activeStatus: newStatus }, activeTab === 0);
        }}
        dateFilter={
          activeTab === 0
            ? myLinkupsFilters.dateFilter
            : requestsFilters.dateFilter
        }
        onDateFilterChange={(newDateFilter) => {
          updateFilters({ dateFilter: newDateFilter }, activeTab === 0);
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
