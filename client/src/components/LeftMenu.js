import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
import logo from "../assets/logo.png";
import CustomUserButton from "./UserButton";
import useSendbirdHandlers from "../handlers/useSendbirdHandlers";
import { setUnreadMessagesCount } from "../redux/actions/messageActions";

const footerHeight = "60px";

const MainContainer = styled("div")(({ theme, colorMode }) => ({
  width: "25%",
  height: "100%",
  overflowY: "auto",
  padding: theme.spacing(4),
  borderRight: "1px solid lightgrey",
  position: "sticky",
  left: 0,
  zIndex: 1000,
  transition: "left 0.3s ease-in-out",
  "@media (max-width: 1380px)": {
    width: "12%", // Change to a narrow width
    padding: theme.spacing(2), // Adjust padding if necessary
  },
}));

const MenuList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const StyledHamburgerMenu = styled(Menu)(({ colorMode }) => ({
  "& .MuiPaper-root": {
    backgroundColor: colorMode === "dark" ? "#3A3A3A" : "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.25)",
    margin: "0 auto",
    overflow: "hidden",
    width: "180px", // Set a fixed width
    maxWidth: "90%", // Allow it to shrink on smaller screens
  },
  zIndex: 2100,
}));

const StyledHamburgerMenuItem = styled(MenuItem)(({ colorMode }) => ({
  color: colorMode === "dark" ? "#FFFFFF" : "#333333",
  fontSize: "16px",
  padding: "12px 16px",
  borderRadius: "10px",
  margin: "4px 0",
  transition: "background-color 0.3s, color 0.3s, transform 0.3s",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#3C3C3C" : "#F5F5F5",
    color: colorMode === "dark" ? "#FFFFFF" : "#000000",
    transform: "scale(1.01)",
    transition:
      "background-color 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s",
    boxShadow: `0 0 5px ${colorMode === "dark" ? "#FFFFFF" : "#000000"}`,
  },
  "&:active": {
    backgroundColor: colorMode === "dark" ? "#5A5A5A" : "#E0E0E0",
  },
}));

const StyledMenuItem = styled("li")(({ theme, isActive, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
  minWidth: "0",
  maxWidth: "100%",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: "8px",
  backgroundColor: isActive
    ? colorMode === "dark"
      ? "rgba(18, 28, 38, 0.8)"
      : "rgba(0, 0, 0, 0.07)"
    : "transparent",
  border: isActive
    ? `2px solid ${colorMode === "dark" ? "#333" : "#DDD"}`
    : "1px solid transparent",
  "&:hover": {
    backgroundColor:
      colorMode === "dark" ? "rgba(18, 28, 38, 0.5)" : "rgba(0, 0, 0, 0.05)",
    borderColor: colorMode === "dark" ? "#444" : "#CCC",
  },
}));

const FooterContainer = styled("div")(({ theme, colorMode }) => ({
  position: "fixed",
  bottom: 0,
  width: "100%",
  height: footerHeight,
  display: "flex",
  justifyContent: "space-between", // More space between buttons
  alignItems: "center",
  padding: "0 20px", // Add padding for a more spacious look
  boxShadow:
    colorMode === "dark"
      ? "0px -4px 12px rgba(255, 255, 255, 0.1)" // Soft shadow for dark mode
      : "0px -4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for light mode
  backgroundColor:
    colorMode === "dark"
      ? "rgba(10, 10, 10, 0.95)" // Slightly darker for contrast
      : "rgba(255, 255, 255, 0.97)",
  borderRadius: "20px 20px 0 0", // Rounded corners at the top
  zIndex: 1000,
}));

const MenuItemLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  width: "100%",
  color: "inherit",
});

const IconWithSpacing = styled("div")({
  display: "flex",
  alignItems: "center",
});

const IconText = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: "inline", // Show text by default
  "@media (max-width: 1380px)": {
    display: "none", // Hide text on smaller screens
  },
}));

const CustomUserButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(2),
}));

const LogoContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  "@media (max-width: 1380px)": {
    justifyContent: "center", // Center logo in narrow view
    marginBottom: theme.spacing(2),
  },
}));

const Logo = styled("img")(({ theme }) => ({
  height: "50px",
}));

const LogoText = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.5px",
  display: "flex",
  alignItems: "center",
  "@media (max-width: 1380px)": {
    display: "none", // Hide text on smaller screens
  },
}));

const BadgeStyled = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    backgroundColor: theme.palette.error.main,
  },
  "& .MuiBadge-badge": {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.error.main,
  },
}));

const FooterMenuButton = ({ to, icon, badgeContent, isActive, colorMode }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <IconWithSpacing
      style={{
        backgroundColor: isActive
          ? colorMode === "dark"
            ? "rgba(255, 255, 255, 0.2)" // Slight contrast for active button
            : "rgba(0, 0, 0, 0.05)"
          : "transparent",
        borderRadius: "50%", // Round buttons
        padding: "10px", // Consistent padding for all buttons
        boxShadow:
          isActive && colorMode === "dark"
            ? "0px 0px 12px rgba(255, 255, 255, 0.5)" // Soft glow on active
            : "none",
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    >
      {badgeContent ? (
        <BadgeStyled
          badgeContent={badgeContent}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {icon}
        </BadgeStyled>
      ) : (
        icon
      )}
    </IconWithSpacing>
  </Link>
);

const LeftMenu = ({ isMobile }) => {
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState(null); // State for the menu
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );

  const unreadMessagesCount = useSelector(
    (state) => state.messages.unreadMessagesCount
  );

  const location = useLocation();
  const { colorMode } = useColorMode();

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none";

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  useSendbirdHandlers((channel) => {
    const unreadMessageCount = channel.unreadMessageCount;
    dispatch(setUnreadMessagesCount(unreadMessageCount));
  });

  if (!isAuthenticated) return null;

  return (
    <>
      {!isMobile && ( // Only render the left menu if not in mobile mode
        <MainContainer colorMode={colorMode}>
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
            />
            <StyledMenuItemComponent
              to="/notifications"
              icon={<NotificationsIcon />}
              text="Notifications"
              badgeContent={unreadNotificationsCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/profile/me"
              icon={<AccountCircleIcon />}
              text="Profile"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/history"
              icon={<HistoryIcon />}
              text="Linkups"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/messages"
              icon={<MessageIcon />}
              text="Messages"
              badgeContent={unreadMessagesCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/settings"
              icon={<SettingsIcon />}
              text="Settings"
              colorMode={colorMode}
              location={location.pathname}
            />
            <CustomUserButtonContainer>
              <CustomUserButton />
            </CustomUserButtonContainer>
          </MenuList>
        </MainContainer>
      )}
      {isMobile && ( // Render the footer only if in mobile mode
        <FooterContainer colorMode={colorMode}>
          <FooterMenuButton
            to="/home"
            icon={<HomeIcon />}
            isActive={location.pathname === "/home"}
          />
          <FooterMenuButton
            to="/notifications"
            icon={
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            }
            isActive={location.pathname === "/notifications"}
          />
          <FooterMenuButton
            to="/profile/me"
            icon={<AccountCircleIcon />}
            isActive={location.pathname === "/profile/me"}
          />
          <FooterMenuButton
            to="/history"
            icon={<HistoryIcon />}
            isActive={location.pathname === "/history"}
          />
          <FooterMenuButton
            to="/messages"
            icon={
              <Badge badgeContent={unreadMessagesCount} color="error">
                <MessageIcon />
              </Badge>
            }
            isActive={location.pathname === "/messages"}
          />
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon
              style={{ color: colorMode === "dark" ? "white" : "black" }}
            />
          </IconButton>
        </FooterContainer>
      )}

      <StyledHamburgerMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top", // Align the top of the menu with the anchor
          horizontal: "center", // Center it horizontally
        }}
        transformOrigin={{
          vertical: "bottom", // The bottom of the menu aligns just above the footer
          horizontal: "center", // Center it horizontally
        }}
        colorMode={colorMode}
      >
        <StyledHamburgerMenuItem
          component={Link}
          to="/settings"
          onClick={handleMenuClose}
          colorMode={colorMode}
        >
          <IconWithSpacing>
            <SettingsIcon
              style={{
                marginRight: "6px", // Adjust the spacing as needed
              }}
            />
            <span>Settings</span>
          </IconWithSpacing>
        </StyledHamburgerMenuItem>
        <StyledHamburgerMenuItem
          onClick={() => {
            handleMenuClose();
          }}
          colorMode={colorMode}
        >
          <CustomUserButton />
        </StyledHamburgerMenuItem>
      </StyledHamburgerMenu>
    </>
  );
};

const StyledMenuItemComponent = ({
  to,
  icon,
  text,
  badgeContent,
  location,
  colorMode,
}) => {
  const isActive = location === to;
  return (
    <StyledMenuItem isActive={isActive} colorMode={colorMode}>
      <MenuItemLink to={to}>
        <IconWithSpacing>
          {badgeContent ? (
            <BadgeStyled
              badgeContent={badgeContent}
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {icon}
            </BadgeStyled>
          ) : (
            icon
          )}
        </IconWithSpacing>
        <IconText>{text}</IconText>
      </MenuItemLink>
    </StyledMenuItem>
  );
};

export default LeftMenu;
