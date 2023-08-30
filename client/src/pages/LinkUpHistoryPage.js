import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { useSelector } from "react-redux";
import LinkupHistoryItem from "../components/LinkupHistoryItem";
import LinkupRequestItem from "../components/LinkupRequestItem";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/linkupActions";
import { getUserLinkups } from "../api/linkupAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FilterBar from "../components/FilterBar";

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

const LinkUpHistoryPage = ({ isMobile }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [linkupList, setLinkupList] = useState([]);
  const [linkupRequestList, setLinkupRequestList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [activeStatus, setActiveStatus] = useState("Active");

  // Use the useLocation hook to get the current pathname
  const location = useLocation();

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);
  const userID = loggedUser.user.id;

  const tabs = [
    { id: 0, label: isMobile ? "Active" : "My Link-Ups" },
    // { id: 1, label: isMobile ? "Expired" : "Expired Link-Ups" },
    { id: 1, label: isMobile ? "Requests" : "Requests" },
  ];

  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  const fetchLinkups = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getUserLinkups(userID);
      if (response.success) {
        setLinkupList(response.linkupList);
      }
    } catch (error) {
      console.log("Error fetching linkups:", error);
    } finally {
      dispatch(setIsLoading(false));
    }

    try {
      dispatch(setIsLoading(true));

      const response = await getLinkupRequests(userID);
      if (response.success) {
        setLinkupRequestList(response.linkupRequestList);
      }
    } catch (error) {
      console.log("Error fetching linkup requests:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, userID]);

  useEffect(() => {
    // Update the active tab based on the location
    switch (location.pathname) {
      case "/history":
        setActiveTab(0); // Set the active tab to 0 (Active Link-Ups)
        break;
      case "/history/expired":
        setActiveTab(1); // Set the active tab to 1 (Expired Link-Ups)
        break;
      case "/history/requests":
        setActiveTab(1); // Set the active tab to 2 (Requests)
        break;
      default:
        setActiveTab(0); // Default to the first tab
    }
    fetchLinkups();
  }, [dispatch, fetchLinkups, location.pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={classes.linkupHistoryPage}>
      <div className={classes.historySection}>
        <TopNavBar title="Link Ups" />
        <Tabs
          className={classes.tabBar}
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"} // Use scrollable variant for mobile
          indicatorColor="primary"
          textColor="primary"
          style={{ width: isMobile ? "100%" : "auto" }} // Adjust width based on mobile mode
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} style={{ width: "33%" }} />
          ))}
        </Tabs>
        {/* Render content based on activeTab */}
        {activeTab === 0 && (
          <div>
            {linkupList
              .filter((linkup) =>
                activeStatus === "All"
                  ? ["active", "expired"].includes(linkup.status)
                  : linkup.status.toLowerCase() === activeStatus.toLowerCase()
              )
              .map((linkUp) => (
                <LinkupHistoryItem
                  key={linkUp.id}
                  post={linkUp}
                  userID={userID}
                />
              ))}
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <div>
              {linkupRequestList.map((request) => (
                <LinkupRequestItem key={request.id} post={request} />
              ))}
            </div>{" "}
          </div>
        )}
      </div>
      <FilterBar
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default LinkUpHistoryPage;
