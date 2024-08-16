import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import { useColorMode } from "@chakra-ui/react";
import logo from "../logo.png";
import CustomUserButton from "./UserButton";
import useSendbirdHandlers from "../handlers/useSendbirdHandlers";
import { setUnreadMessagesCount } from "../redux/actions/messageActions";

const drawerWidth = "20%";

const MainContainer = styled("div")(({ theme, isMobile }) => ({
  flex: `0 0 ${drawerWidth}`,
  padding: theme.spacing(4),
  borderRight: "1px solid lightgrey",
  position: isMobile ? "fixed" : "sticky",
  bottom: isMobile ? 0 : "auto",
  left: isMobile ? 0 : "auto",
  width: isMobile ? "100%" : "auto",
  boxShadow: isMobile ? "0px -2px 4px rgba(0, 0, 0, 0.1)" : "none",
  zIndex: isMobile ? 1000 : "auto",
}));

const MenuList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const StyledMenuItem = styled("li")(({ theme, isActive }) => ({
  padding: theme.spacing(2),
  borderRadius: "100px",
  backgroundColor: isActive
    ? theme.palette.mode === "dark"
      ? "rgba(18, 28, 38, 0.9)"
      : "transparent"
    : "transparent",
  display: "flex",
  alignItems: "center",
  border: isActive
    ? `2px solid ${theme.palette.mode === "dark" ? "transparent" : "#F1F1FA"}`
    : "none",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(18, 28, 38, 0.1)"
        : "rgba(18, 28, 38, 0.3)",
    borderColor: theme.palette.mode === "dark" ? "#333" : "#CCC", // Adjust the border color on hover
  },
}));

const MenuItemLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
});

const LogoContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(2),
  },
}));

const Logo = styled("img")(({ theme }) => ({
  height: "50px",
  marginBottom: theme.spacing(2),
  backgroundColor: "#000", // Set the background color to black
}));

const MobileMenu = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: theme.spacing(1),
}));

const MobileMenuItem = styled("div")(({ theme }) => ({
  fontSize: "1.5rem",
  padding: theme.spacing(1),
  textDecoration: "none",
}));

const BadgeStyled = styled(Badge)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const LeftMenu = ({ isMobile }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );

  const unreadMessagesCount = useSelector(
    (state) => state.messages.unreadMessagesCount
  );

  const handleUnreadMessageCountUpdate = (channel) => {
    const unreadMessageCount = channel.unreadMessageCount;
    dispatch(setUnreadMessagesCount(unreadMessageCount));
  };

  useSendbirdHandlers(handleUnreadMessageCountUpdate);

  const location = useLocation(); // Get the current route location
  const { colorMode } = useColorMode();

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none"; // Set filter style based on colorMode

  return isAuthenticated ? (
    <MainContainer isMobile={isMobile}>
      {isMobile ? (
        <MobileMenu>
          <StyledMenuItemComponent
            to="/home"
            icon={<HomeIcon />}
            location={location.pathname}
          />
          <StyledMenuItemComponent
            to="/notifications"
            icon={<NotificationsIcon />}
            badgeContent={unreadNotificationsCount}
            location={location.pathname}
          />
          <StyledMenuItemComponent
            to="/profile/me"
            icon={<AccountCircleIcon />}
            location={location.pathname}
          />
          <StyledMenuItemComponent
            to="/history"
            icon={<HistoryIcon />}
            location={location.pathname}
          />
          <StyledMenuItemComponent
            to="/messages"
            icon={<MessageIcon />}
            location={location.pathname}
            badgeContent={unreadMessagesCount} // Pass the count to the messaging icon
          />
          <StyledMenuItemComponent
            to="/settings"
            icon={<SettingsIcon />}
            location={location.pathname}
          />
          <MobileMenuItem>
            <CustomUserButton />
          </MobileMenuItem>
        </MobileMenu>
      ) : (
        <div>
          <LogoContainer>
            <Logo src={logo} alt="Logo" style={{ filter: filterStyle }} />
          </LogoContainer>
          <MenuList>
            <StyledMenuItemComponent
              to="/home"
              icon={<HomeIcon />}
              text="Home"
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/notifications"
              icon={<NotificationsIcon />}
              text="Notifications"
              badgeContent={unreadNotificationsCount}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/profile/me"
              icon={<AccountCircleIcon />}
              text="Profile"
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/history"
              icon={<HistoryIcon />}
              text="Link-Ups"
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/messages"
              icon={<MessageIcon />}
              text="Messages"
              location={location.pathname}
              badgeContent={unreadMessagesCount} // Pass the count to the messaging icon
            />
            <StyledMenuItemComponent
              to="/settings"
              icon={<SettingsIcon />}
              text="Settings"
              location={location.pathname}
            />
            <StyledMenuItem>
              <CustomUserButton />
            </StyledMenuItem>
          </MenuList>
        </div>
      )}
    </MainContainer>
  ) : null;
};

const StyledMenuItemComponent = ({
  to,
  icon,
  text,
  badgeContent,
  location,
}) => {
  const { colorMode } = useColorMode();
  const isActive = location.startsWith(to);

  return (
    <StyledMenuItem isActive={isActive}>
      <MenuItemLink to={to}>
        {icon}
        <div style={{ marginRight: "24px" }}>{text}</div>
        {badgeContent > 0 && (
          <BadgeStyled
            badgeContent={parseInt(badgeContent)}
            overlap="rectangular"
            color="secondary"
          />
        )}
      </MenuItemLink>
    </StyledMenuItem>
  );
};

export default LeftMenu;
