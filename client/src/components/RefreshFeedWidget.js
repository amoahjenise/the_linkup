import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";

const WidgetContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "sm",
  borderRadius: "24px",
  borderWidth: "1px",
  border: "0.1px solid #lightgray",
  overflow: "hidden",
  padding: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
  backgroundColor: "rgba(200, 200, 200, 0.1)",
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const Icon = styled(FontAwesomeIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const RefreshButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#0097A7",
  "&:hover": {
    backgroundColor: "#007b86", // Slightly darker color on hover
  },
}));

const RefreshFeedWidget = ({ onRefreshClick }) => {
  return (
    <WidgetContainer>
      <Header>
        <Icon icon={faSync} />
        <span>Refresh Feed</span>
      </Header>
      <div>
        <Tooltip title="Refresh">
          <RefreshButton
            onClick={onRefreshClick}
            color="primary"
            aria-label="refresh"
            size="large"
          >
            <RefreshIcon style={{ color: "white" }} />
          </RefreshButton>
        </Tooltip>
      </div>
    </WidgetContainer>
  );
};

export default RefreshFeedWidget;
