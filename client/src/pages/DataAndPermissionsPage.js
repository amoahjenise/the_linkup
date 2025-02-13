import React, { useState } from "react";
import { styled } from "@mui/system";
import { Button, Typography, FormControlLabel, Switch } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";

const PageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "2rem",
  //   backgroundColor: theme.palette.background.default,
  //   color: theme.palette.text.primary,
  minHeight: "100vh",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  //   color: theme.palette.text.secondary,
}));

const SectionDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: "2rem",
  //   color: theme.palette.text.secondary,
}));

const PermissionsSection = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "2rem",
  backgroundColor:
    colorMode === "light" ? theme.palette.background.paper : "#1a1a1a",
  padding: "1rem",
  borderRadius: "0.75rem",
  boxShadow: theme.shadows[1],
}));

const PermissionItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1rem",
  //   color: theme.palette.text.primary,
}));

const SaveButton = styled(Button)(({ theme }) => ({
  alignSelf: "flex-start",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.75rem",
  fontWeight: "bold",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const DataAndPermissionsPage = () => {
  const { colorMode } = useColorMode();
  const [permissions, setPermissions] = useState({
    dataAccess: true,
    emailNotifications: false,
    marketingPermissions: true,
  });

  const handleToggle = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  return (
    <PageContainer>
      <SectionTitle variant="h6">Data & Permissions</SectionTitle>
      <SectionDescription>
        Manage the permissions for the data you share with our platform and
        adjust notification settings.
      </SectionDescription>

      <PermissionsSection colorMode={colorMode}>
        <PermissionItem>
          <Typography variant="body2">Data Access</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={permissions.dataAccess}
                onChange={() => handleToggle("dataAccess")}
                color="primary"
              />
            }
            label={permissions.dataAccess ? "Enabled" : "Disabled"}
          />
        </PermissionItem>

        <PermissionItem>
          <Typography variant="body2">Email Notifications</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={permissions.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                color="primary"
              />
            }
            label={permissions.emailNotifications ? "Enabled" : "Disabled"}
          />
        </PermissionItem>

        <PermissionItem>
          <Typography variant="body2">Marketing Permissions</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={permissions.marketingPermissions}
                onChange={() => handleToggle("marketingPermissions")}
                color="primary"
              />
            }
            label={permissions.marketingPermissions ? "Enabled" : "Disabled"}
          />
        </PermissionItem>
      </PermissionsSection>

      <SaveButton variant="contained">Save Changes</SaveButton>
    </PageContainer>
  );
};

export default DataAndPermissionsPage;
