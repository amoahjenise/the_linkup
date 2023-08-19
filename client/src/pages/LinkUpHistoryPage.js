import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinkupHistoryItem from "../components/LinkupHistoryItem";
import LeftMenu from "../components/LeftMenu";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/linkupActions";
import { getLinkups } from "../api/linkupAPI";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  linkUpHistoryPage: {
    display: "flex",
    height: "100vh",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxWidth: `calc(100% - 2.5 * ${drawerWidth})`,
    width: "100%",
    borderRight: "1px solid #e1e8ed",
  },
}));

const LinkUpHistoryPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [linkupList, setLinkupList] = useState([]);
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
    dispatch(setIsLoading(true));

    try {
      const response = await getLinkups(userID);
      if (response.success) {
        setLinkupList(response.linkupList);
      }
    } catch (error) {
      console.log("Error fetching linkups:", error);
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
      <LeftMenu />
      <div className={classes.mainContainer}>
        <TopNavBar title="Link Ups" />
        <Tabs value={activeTab} onChange={handleTabChange}>
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
            <p>Tab 3</p>
          </div>
        )}
      </div>
      <div style={{ flex: 2 }} />
    </div>
  );
};

export default LinkUpHistoryPage;
