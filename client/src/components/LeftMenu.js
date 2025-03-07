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

// Define colors for light and dark modes
const lightModeColors = {
  background: "#FFFFFF", // White
  accent: "#00796B", // Teal
  hover: "#F5F5F5", // Light Gray
  text: "#000000", // Black
};

const darkModeColors = {
  background: "#000000", // Black
  accent: "#FFFFFF", // White
  hover: "#333333", // Dark Gray
  text: "#FFFFFF", // White
};

const MainContainer = styled("div")(({ theme, colorMode }) => ({
  width: "25%",
  height: "100%",
  overflowY: "auto",
  padding: theme.spacing(4),
  borderRight: `1px solid ${colorMode === "dark" ? "white" : "lightgrey"}`,
  position: "sticky",
  left: 0,
  transition: "left 0.3s ease-in-out",
  background:
    colorMode === "dark"
      ? darkModeColors.background
      : lightModeColors.background,
  "@media (max-width: 1380px)": {
    width: "12%",
    padding: theme.spacing(2),
  },
}));

const MenuList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const StyledHamburgerMenu = styled(Menu)(({ colorMode }) => ({
  "& .MuiPaper-root": {
    backgroundColor:
      colorMode === "dark"
        ? darkModeColors.background
        : lightModeColors.background,
    borderRadius: "8px",
    boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.3)`,
    margin: "0 auto",
    overflow: "hidden",
    width: "180px",
    maxWidth: "90%",
  },
  zIndex: 2100,
}));

const StyledHamburgerMenuItem = styled(MenuItem)(({ colorMode }) => ({
  color: colorMode === "dark" ? darkModeColors.text : lightModeColors.text,
  fontSize: "14px",
  padding: "12px 16px",
  borderRadius: "4px",
  margin: "4px 0",
  transition: "background-color 0.3s, color 0.3s",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor:
      colorMode === "dark" ? darkModeColors.hover : lightModeColors.hover,
    color:
      colorMode === "dark" ? darkModeColors.accent : lightModeColors.accent,
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
    ? `2px solid ${
        colorMode === "dark" ? darkModeColors.hover : lightModeColors.hover
      }`
    : "1px solid transparent",
  "&:hover": {
    backgroundColor:
      colorMode === "dark" ? "rgba(18, 28, 38, 0.5)" : "rgba(0, 0, 0, 0.05)",
    borderColor:
      colorMode === "dark" ? darkModeColors.hover : lightModeColors.hover,
  },
}));

const FooterContainer = styled("div")(({ theme, colorMode }) => ({
  position: "fixed",
  bottom: 0,
  width: "100%",
  height: footerHeight,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  boxShadow: `0px -4px 12px rgba(0, 0, 0, 0.3)`,
  backgroundColor:
    colorMode === "dark"
      ? darkModeColors.background
      : lightModeColors.background,
  borderRadius: "8px 8px 0 0",
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

const IconText = styled("span")(({ theme, colorMode }) => ({
  marginLeft: theme.spacing(2),
  display: "inline",
  fontSize: "14px",
  color: colorMode === "dark" ? darkModeColors.text : lightModeColors.text,
  "@media (max-width: 1380px)": {
    display: "none",
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
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
}));

const Logo = styled("img")(({ theme }) => ({
  height: "50px",
}));

const LogoText = styled("div")(({ theme, colorMode }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: "'Roboto', sans-serif",
  color: colorMode === "dark" ? darkModeColors.text : lightModeColors.text,
  "@media (max-width: 1380px)": {
    display: "none",
  },
}));

const BadgeStyled = styled(Badge)(({ theme, colorMode }) => ({
  "& .MuiBadge-dot": {
    backgroundColor: theme.palette.error.main,
  },
  "& .MuiBadge-badge": {
    color:
      colorMode === "dark"
        ? darkModeColors.background
        : lightModeColors.background,
    backgroundColor: theme.palette.error.main,
  },
}));

const FooterMenuButton = ({ to, icon, badgeContent, isActive, colorMode }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <IconWithSpacing
      style={{
        backgroundColor: isActive
          ? colorMode === "dark"
            ? darkModeColors.hover
            : lightModeColors.hover
          : "transparent",
        borderRadius: "8px",
        padding: "10px",
        transition: "background-color 0.3s",
      }}
    >
      {badgeContent ? (
        <BadgeStyled
          badgeContent={badgeContent}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          colorMode={colorMode}
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );
  const unreadMessagesCount = useSelector(
    (state) => state.messages.unreadMessagesCount
  );
  const isInConversation = useSelector(
    (state) => state.conversation.isInConversation
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
      {!isMobile && (
        <MainContainer colorMode={colorMode}>
          <LogoContainer>
            <Logo src={logo} alt="Logo" style={{ filter: filterStyle }} />
            <LogoText colorMode={colorMode}>The Linkup</LogoText>
          </LogoContainer>
          <MenuList>
            <StyledMenuItemComponent
              to="/home"
              icon={
                <HomeIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              text="Home"
              location={location.pathname}
              colorMode={colorMode}
            />
            <StyledMenuItemComponent
              to="/notifications"
              icon={
                <NotificationsIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              text="Notifications"
              badgeContent={unreadNotificationsCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/profile/me"
              icon={
                <AccountCircleIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              text="Profile"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/history"
              icon={
                <HistoryIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              text="Linkups"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/messages"
              icon={
                <MessageIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              text="Messages"
              badgeContent={unreadMessagesCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/settings"
              icon={
                <SettingsIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
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
      {isMobile &&
        !isInConversation && ( // Only render mobile menu when the state allows
          <FooterContainer colorMode={colorMode}>
            <FooterMenuButton
              to="/home"
              icon={
                <HomeIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              isActive={location.pathname === "/home"}
              colorMode={colorMode}
            />
            <FooterMenuButton
              to="/notifications"
              icon={
                <Badge badgeContent={unreadNotificationsCount} color="error">
                  <NotificationsIcon
                    style={{
                      color:
                        colorMode === "dark"
                          ? darkModeColors.text
                          : lightModeColors.text,
                    }}
                  />
                </Badge>
              }
              isActive={location.pathname === "/notifications"}
              colorMode={colorMode}
            />
            <FooterMenuButton
              to="/profile/me"
              icon={
                <AccountCircleIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              isActive={location.pathname === "/profile/me"}
              colorMode={colorMode}
            />
            <FooterMenuButton
              to="/history"
              icon={
                <HistoryIcon
                  style={{
                    color:
                      colorMode === "dark"
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                />
              }
              isActive={
                location.pathname === "/history" ||
                location.pathname === "/history/requests-sent" ||
                location.pathname === "/history/requests-received"
              }
              colorMode={colorMode}
            />
            <FooterMenuButton
              to="/messages"
              icon={
                <Badge badgeContent={unreadMessagesCount} color="error">
                  <MessageIcon
                    style={{
                      color:
                        colorMode === "dark"
                          ? darkModeColors.text
                          : lightModeColors.text,
                    }}
                  />
                </Badge>
              }
              isActive={location.pathname === "/messages"}
              colorMode={colorMode}
            />
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon
                style={{
                  color:
                    colorMode === "dark"
                      ? darkModeColors.text
                      : lightModeColors.text,
                }}
              />
            </IconButton>
          </FooterContainer>
        )}

      <StyledHamburgerMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
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
                marginRight: "6px",
                color:
                  colorMode === "dark"
                    ? darkModeColors.text
                    : lightModeColors.text,
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
  const isActive =
    location === to ||
    (to === "/history" &&
      (location === "/history" ||
        location === "/history/requests-sent" ||
        location === "/history/requests-received"));
  return (
    <StyledMenuItem isActive={isActive} colorMode={colorMode}>
      <MenuItemLink to={to}>
        <IconWithSpacing>
          {badgeContent ? (
            <BadgeStyled
              badgeContent={badgeContent}
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              colorMode={colorMode}
            >
              {icon}
            </BadgeStyled>
          ) : (
            icon
          )}
        </IconWithSpacing>
        <IconText colorMode={colorMode}>{text}</IconText>
      </MenuItemLink>
    </StyledMenuItem>
  );
};

export default LeftMenu;
