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
import logo from "../assets/logo.png";
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
    left: isMobile ? (isOpen ? 0 : "-100%") : "auto",
    width: isMobile ? "100%" : drawerWidth,
    boxShadow: isMobile ? "0px -2px 4px rgba(0, 0, 0, 0.1)" : "none",
    zIndex: isMobile ? 10000 : "auto",
    backgroundColor: isMobile
      ? colorMode === "dark"
        ? "#1A202C"
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
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: "8px", // Slight rounding for the clean look
  backgroundColor: isActive
    ? colorMode === "dark"
      ? "rgba(18, 28, 38, 0.8)" // Slightly more muted for a clean look
      : "rgba(0, 0, 0, 0.07)"
    : "transparent",
  display: "flex",
  alignItems: "center",
  border: isActive
    ? `2px solid ${colorMode === "dark" ? "#333" : "#DDD"}`
    : "1px solid transparent",
  flexGrow: 1, // Make the item grow to fit its content
  minWidth: "0", // Prevent overflow by letting text wrap
  maxWidth: "100%", // Ensure the item doesn't exceed its container width
  "&:hover": {
    backgroundColor:
      colorMode === "dark" ? "rgba(18, 28, 38, 0.5)" : "rgba(0, 0, 0, 0.05)",
    borderColor: colorMode === "dark" ? "#444" : "#CCC",
  },
}));

const MenuItemLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  width: "100%",
  color: "inherit",
  flexGrow: 1, // Allow the link to grow and take up available space
  whiteSpace: "nowrap", // Prevent text from collapsing
  overflow: "hidden", // Hide overflow
  textOverflow: "ellipsis", // Use ellipsis when text overflows
});

const IconWithSpacing = styled("div")({
  display: "flex",
  alignItems: "center",
  marginRight: "16px", // Adjust the spacing as needed
});

const LogoContainer = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(2),
  },
}));

const Logo = styled("img")(({ theme }) => ({
  height: "50px",
}));

const LogoText = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "1.5rem", // Adjust font size as needed
  fontWeight: "bold",
  fontFamily: "'Poppins', sans-serif", // Use a stylish font (ensure the font is loaded)
  letterSpacing: "0.5px", // Adjust letter spacing if needed
  display: "flex",
  alignItems: "center",
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
  "& .MuiBadge-dot": {
    backgroundColor: theme.palette.error.main, // Badge dot color
  },
  "& .MuiBadge-badge": {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.error.main, // Badge background color
    fontSize: "0.75rem", // Font size for the badge count
    height: "20px", // Height of the badge
    minWidth: "20px", // Minimum width of the badge
    borderRadius: "50%", // Make the badge circular
    padding: "0 6px", // Padding inside the badge
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    transform: "translate(50%, -50%)",
  },
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
              <LogoText>The Linkup</LogoText>
            </LogoContainer>
            <MenuList>
              <StyledMenuItemComponent
                to="/home"
                icon={<HomeIcon />}
                text="Home"
                location={location.pathname}
                colorMode={colorMode}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/notifications"
                icon={<NotificationsIcon />}
                text="Notifications"
                badgeContent={unreadNotificationsCount}
                colorMode={colorMode}
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/profile/me"
                icon={<AccountCircleIcon />}
                text="Profile"
                colorMode={colorMode}
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/history"
                icon={<HistoryIcon />}
                text="Linkups"
                colorMode={colorMode}
                location={location.pathname}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/messages"
                icon={<MessageIcon />}
                text="Messages"
                badgeContent={unreadMessagesCount}
                colorMode={colorMode}
                toggleMenu={isMobile ? toggleMenu : null}
              />
              <StyledMenuItemComponent
                to="/settings"
                icon={<SettingsIcon />}
                text="Settings"
                colorMode={colorMode}
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
  colorMode,
  toggleMenu,
}) => {
  const isActive = location === to;
  return (
    <StyledMenuItem isActive={isActive} colorMode={colorMode}>
      <MenuItemLink to={to} onClick={toggleMenu}>
        <IconWithSpacing>
          {badgeContent ? (
            <BadgeStyled
              badgeContent={badgeContent}
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {icon}
            </BadgeStyled>
          ) : (
            icon
          )}
        </IconWithSpacing>
        {text}
      </MenuItemLink>
    </StyledMenuItem>
  );
};

export default LeftMenu;
