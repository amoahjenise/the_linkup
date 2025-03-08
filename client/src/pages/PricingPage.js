import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useColorMode } from "@chakra-ui/react";
import TopNavBar from "../components/TopNavBar";

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  paddingTop: theme.spacing(15), // Add padding to avoid overlap
}));

const PricingContainer = styled(Box)(({ theme, paddingTop }) => ({
  padding: theme.spacing(4),
  maxWidth: "1200px",
  textAlign: "center",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  paddingTop: paddingTop, // dynamic padding based on screen width
}));

const PlanCard = styled(Paper)(({ theme, isHighlighted }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: isHighlighted ? theme.shadows[6] : theme.shadows[3],
  border: isHighlighted ? `2px solid ${theme.palette.primary.main}` : "none",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "rgba(200, 220, 207, 0.13)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  textAlign: "left",
  marginTop: theme.spacing(2),
  flexGrow: 1,
  overflowY: "auto",
  maxHeight: "200px",
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Footer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  paddingBottom: theme.spacing(10), // Fixes footer being hidden behind mobile menu
}));

const PricingPage = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between(500, 600)); // New breakpoint for 500px - 600px

  // Adjust padding based on screen width
  const paddingTop = isMediumScreen ? 400 : isMobile ? 150 : 0;

  const plans = [
    {
      title: "Free Plan",
      price: "$0",
      description: "Basic features to get started",
      features: [
        "Create up to 2 linkups per month",
        "Join up to 10 linkups per month",
        "Basic profile customization",
        "Ads-supported experience",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outlined",
      isHighlighted: false,
    },
    {
      title: "Pro Plan",
      price: "$9.99",
      description: "Unlock premium features",
      features: [
        "Create and join unlimited linkups",
        "Advanced profile customization (banners)",
        "Boost linkup visibility (priority ranking in search)",
        "Advanced analytics (who viewed your linkup, engagement insights)",
        "Ad-free experience (no interruptions)",
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "contained",
      isHighlighted: true,
    },
  ];

  return (
    <PageContainer>
      <TopNavBar title="Choose Your Plan" />

      {/* Scrollable Content */}
      <ContentContainer>
        <PricingContainer paddingTop={paddingTop}>
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
                <PlanCard isHighlighted={plan.isHighlighted}>
                  <Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      gutterBottom
                      color={colorMode === "dark" ? "white" : "black"}
                    >
                      {plan.title}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      gutterBottom
                      color={colorMode === "dark" ? "white" : "black"}
                    >
                      {plan.price}
                      <Typography
                        variant="body2"
                        component="span"
                        color={colorMode === "dark" ? "white" : "textSecondary"}
                      >
                        /mo
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body1"
                      color={colorMode === "dark" ? "white" : "textSecondary"}
                      gutterBottom
                    >
                      {plan.description}
                    </Typography>
                  </Box>
                  <FeatureList color={colorMode === "dark" ? "white" : "black"}>
                    {plan.features.map((feature, idx) => (
                      <FeatureItem key={idx}>
                        <CheckCircleIcon color="primary" />
                        <Typography variant="body1">{feature}</Typography>
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  <Button
                    variant={plan.buttonVariant}
                    color="primary"
                    fullWidth
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      mt: 2,
                      backgroundColor:
                        plan.title === "Free Plan" && colorMode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : undefined,
                      color:
                        plan.title === "Free Plan" && colorMode === "dark"
                          ? "rgba(255, 255, 255, 0.5)"
                          : undefined,
                      "&.Mui-disabled": {
                        backgroundColor:
                          colorMode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "rgba(0, 0, 0, 0.12)",
                        color:
                          colorMode === "dark"
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(0, 0, 0, 0.5)",
                      },
                    }}
                    disabled={plan.title === "Free Plan"}
                  >
                    {plan.buttonText}
                  </Button>
                </PlanCard>
              </Grid>
            ))}
          </Grid>

          {/* Footer */}
          <Footer>
            <Typography
              variant="body2"
              color={colorMode === "dark" ? "lightgray" : "textSecondary"}
            >
              * You can cancel your subscription at any time.{" "}
            </Typography>
          </Footer>
        </PricingContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default PricingPage;
