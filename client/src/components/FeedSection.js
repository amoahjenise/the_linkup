import React from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deleteLinkup } from "../api/linkupAPI";

const FeedSection = ({ linkupList, isLoading, setShouldFetchLinkups }) => {
  const userSentRequests = useSelector((state) => state.userSentRequests);

  return (
    <div>
      <TopNavBar title="Home" />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div>
          {linkupList.length === 0 ? (
            <EmptyFeedPlaceholder />
          ) : (
            linkupList?.map((linkup) => (
              <LinkupItem
                key={linkup.id}
                linkupItem={linkup}
                setShouldFetchLinkups={setShouldFetchLinkups}
                disableRequest={userSentRequests.includes(linkup.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkupList: state.linkups.linkupList,
  isLoading: state.linkups.isLoading,
});

const mapDispatchToProps = {
  deleteLinkup,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedSection);
