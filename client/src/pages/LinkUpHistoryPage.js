import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinkupHistoryItem from "../components/LinkupHistoryItem";
import LinkupRequestItem from "../components/LinkupRequestItem";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/linkupActions";
import { getLinkupRequests, getUserLinkups } from "../api/linkupAPI";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  linkUpHistoryPage: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "50%",
    borderRight: "1px solid #e1e8ed",
  },
  tabBar: {
    borderBottom: "1px solid lightgrey",
  },
}));

const LinkUpHistoryPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [linkupList, setLinkupList] = useState([]);
  const [linkupRequestList, setLinkupRequestList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);
  const userID = loggedUser.user.id;

  const tabs = [
    { id: 0, label: "Active Link-Ups" },
    { id: 1, label: "Expired Link-Ups" },
    { id: 2, label: "Requests Sent" },
  ];

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
    fetchLinkups();
  }, [dispatch, fetchLinkups]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={classes.linkUpHistoryPage}>
      <TopNavBar title="Link Ups" />
      <Tabs
        className={classes.tabBar}
        value={activeTab}
        onChange={handleTabChange}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} label={tab.label} />
        ))}
      </Tabs>
      {/* Render content based on activeTab */}
      {activeTab === 0 && (
        <div>
          {linkupList
            .filter((linkup) => linkup.status === "active")
            .map((linkUp) => (
              <LinkupHistoryItem key={linkUp.id} post={linkUp} />
            ))}
        </div>
      )}
      {activeTab === 1 && (
        <div>
          {linkupList
            .filter((linkup) => linkup.status === "expired")
            .map((linkUp) => (
              <LinkupHistoryItem key={linkUp.id} post={linkUp} />
            ))}
        </div>
      )}
      {activeTab === 2 && (
        <div>
          <div>
            {linkupRequestList.map((request) => (
              <LinkupRequestItem key={request.id} post={request} />
            ))}
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default LinkUpHistoryPage;
