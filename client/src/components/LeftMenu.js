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

const steamBackground = "#000000"; // Black
const steamAccent = "#FFFFFF"; // White
const steamHover = "#333333"; // Dark Gray
const steamText = "#FFFFFF"; // White

const MainContainer = styled("div")(({ theme, colorMode }) => ({
  width: "25%",
  height: "100%",
  overflowY: "auto",
  padding: theme.spacing(4),
  borderRight: `1px solid ${steamHover}`,
  position: "sticky",
  left: 0,
  transition: "left 0.3s ease-in-out",
  background: steamBackground,
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
    backgroundColor: steamBackground,
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
  color: steamText,
  fontSize: "14px",
  padding: "12px 16px",
  borderRadius: "4px",
  margin: "4px 0",
  transition: "background-color 0.3s, color 0.3s",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: steamHover,
    color: steamAccent,
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
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  boxShadow: `0px -4px 12px rgba(0, 0, 0, 0.3)`,
  backgroundColor: steamBackground,
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

const IconText = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: "inline",
  fontSize: "14px",
  color: steamText,
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

const LogoText = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: "'Roboto', sans-serif",
  color: steamText,
  "@media (max-width: 1380px)": {
    display: "none",
  },
}));

const BadgeStyled = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    backgroundColor: steamAccent,
  },
  "& .MuiBadge-badge": {
    color: steamBackground,
    backgroundColor: steamAccent,
  },
}));

const FooterMenuButton = ({ to, icon, badgeContent, isActive, colorMode }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <IconWithSpacing
      style={{
        backgroundColor: isActive ? steamHover : "transparent",
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
            <LogoText>The Linkup</LogoText>
          </LogoContainer>
          <MenuList>
            <StyledMenuItemComponent
              to="/home"
              icon={<HomeIcon style={{ color: steamText }} />}
              text="Home"
              location={location.pathname}
              colorMode={colorMode}
            />
            <StyledMenuItemComponent
              to="/notifications"
              icon={<NotificationsIcon style={{ color: steamText }} />}
              text="Notifications"
              badgeContent={unreadNotificationsCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/profile/me"
              icon={<AccountCircleIcon style={{ color: steamText }} />}
              text="Profile"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/history"
              icon={<HistoryIcon style={{ color: steamText }} />}
              text="Linkups"
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/messages"
              icon={<MessageIcon style={{ color: steamText }} />}
              text="Messages"
              badgeContent={unreadMessagesCount}
              colorMode={colorMode}
              location={location.pathname}
            />
            <StyledMenuItemComponent
              to="/settings"
              icon={<SettingsIcon style={{ color: steamText }} />}
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
      {isMobile && (
        <FooterContainer colorMode={colorMode}>
          <FooterMenuButton
            to="/home"
            icon={<HomeIcon style={{ color: steamText }} />}
            isActive={location.pathname === "/home"}
          />
          <FooterMenuButton
            to="/notifications"
            icon={
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon style={{ color: steamText }} />
              </Badge>
            }
            isActive={location.pathname === "/notifications"}
          />
          <FooterMenuButton
            to="/profile/me"
            icon={<AccountCircleIcon style={{ color: steamText }} />}
            isActive={location.pathname === "/profile/me"}
          />
          <FooterMenuButton
            to="/history"
            icon={<HistoryIcon style={{ color: steamText }} />}
            isActive={location.pathname === "/history"}
          />
          <FooterMenuButton
            to="/messages"
            icon={
              <Badge badgeContent={unreadMessagesCount} color="error">
                <MessageIcon style={{ color: steamText }} />
              </Badge>
            }
            isActive={location.pathname === "/messages"}
          />
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon style={{ color: steamText }} />
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
            <SettingsIcon style={{ marginRight: "6px", color: steamText }} />
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
