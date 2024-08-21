import React, { useState } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useColorMode } from "@chakra-ui/react";
import logo from "../logo.png";
import CustomUserButton from "./UserButton";
import useSendbirdHandlers from "../handlers/useSendbirdHandlers";
import { setUnreadMessagesCount } from "../redux/actions/messageActions";

const drawerWidth = "20%";

const MainContainer = styled("div")(
  ({ theme, isMobile, isOpen, colorMode }) => ({
    flex: `0 0 ${drawerWidth}`,
    padding: theme.spacing(4),
    borderRight: "1px solid lightgrey",
    position: isMobile ? "fixed" : "sticky",
    bottom: isMobile && isOpen ? 0 : "auto",
    left: isMobile ? (isOpen ? 0 : "-100%") : "auto", // Move off-screen when closed
    width: isMobile ? "100%" : drawerWidth,
    boxShadow: isMobile ? "0px -2px 4px rgba(0, 0, 0, 0.1)" : "none",
    zIndex: isMobile ? 10000 : "auto",
    backgroundColor: isMobile
      ? colorMode === "dark"
        ? "#1e1e1e"
        : "white"
      : "transparent",
    height: isMobile ? (isOpen ? "100vh" : "auto") : "100%",
    transition: "left 0.3s ease-in-out",
  })
);

const MenuList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const StyledMenuItem = styled("li")(({ theme, isActive, colorMode }) => ({
  padding: theme.spacing(2),
  borderRadius: "100px",
  backgroundColor: isActive
    ? colorMode === "dark"
      ? "rgba(18, 28, 38, 0.9)"
      : "transparent"
    : "transparent",
  display: "flex",
  alignItems: "center",
  border: isActive
    ? `2px solid ${colorMode === "dark" ? "transparent" : "#F1F1FA"}`
    : "none",
  "&:hover": {
    backgroundColor:
      colorMode === "dark" ? "rgba(18, 28, 38, 0.1)" : "rgba(18, 28, 38, 0.3)",
    borderColor: colorMode === "dark" ? "#333" : "#CCC", // Adjust the border color on hover
  },
}));

const MenuItemLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  width: "100%", // Ensure link occupies full width
  color: "inherit", // Inherit color from StyledMenuItem
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
  backgroundColor: "#000",
}));

const MobileMenuButton = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  backgroundColor: "#0097A7",
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 1100,
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
}));

const BadgeStyled = styled(Badge)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const LeftMenu = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const location = useLocation();
  const { colorMode } = useColorMode();

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return isAuthenticated ? (
    <>
      <MainContainer isMobile={isMobile} isOpen={isOpen} colorMode={colorMode}>
        {isMobile && (
          <MobileMenuButton onClick={toggleMenu}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        )}
        {(isOpen || !isMobile) && (
          <>
            <LogoContainer>
              <Logo src={logo} alt="Logo" style={{ filter: filterStyle }} />
            </LogoContainer>
            <MenuList>
              <StyledMenuItemComponent
                to="/home"
                icon={<HomeIcon />}
                text="Home"
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/notifications"
                icon={<NotificationsIcon />}
                text="Notifications"
                badgeContent={unreadNotificationsCount}
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/profile/me"
                icon={<AccountCircleIcon />}
                text="Profile"
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/history"
                icon={<HistoryIcon />}
                text="Link-Ups"
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/messages"
                icon={<MessageIcon />}
                text="Messages"
                location={location.pathname}
                badgeContent={unreadMessagesCount}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/settings"
                icon={<SettingsIcon />}
                text="Settings"
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItem>
                <CustomUserButton />
              </StyledMenuItem>
            </MenuList>
          </>
        )}
      </MainContainer>
    </>
  ) : null;
};

const StyledMenuItemComponent = ({
  to,
  icon,
  text,
  badgeContent,
  location,
  toggleMenu,
}) => {
  const isActive = location === to;
  return (
    <StyledMenuItem isActive={isActive}>
      <MenuItemLink to={to} onClick={toggleMenu}>
        {badgeContent ? (
          <BadgeStyled badgeContent={badgeContent}>{icon}</BadgeStyled>
        ) : (
          icon
        )}
        {text}
      </MenuItemLink>
    </StyledMenuItem>
  );
};

export default LeftMenu;
