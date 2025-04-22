import React from "react";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

const Root = styled(Box)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  minHeight: "100vh",
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

const Section = styled(Container)(({ theme }) => ({
  maxWidth: "1280px",
  margin: "0 auto",
  padding: theme.spacing(4, 3),
}));

const GridLayout = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(8),
  marginTop: theme.spacing(10),
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "1fr 1fr",
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(16),
  paddingTop: theme.spacing(6),
  borderTop: "1px solid #2d2d2d",
  color: "#aaa",
  fontSize: "0.875rem",
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: theme.spacing(3),
}));

export default function AboutPage() {
  return (
    <Root>
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            The Linkup is where real moments happen.
          </Typography>
        </motion.div>
        <Typography variant="h6" sx={{ color: "#ccc", maxWidth: 720, mb: 6 }}>
          Whether you’re meeting new people, organizing a weekend hike, or
          planning a startup brainstorm — The Linkup is your spontaneous social
          network built for authentic connections.
        </Typography>
      </Section>

      <Section>
        <GridLayout>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Our Mission
            </Typography>
            <Typography sx={{ color: "#aaa" }}>
              At The Linkup, we believe social apps should help people connect
              in real life — not just scroll endlessly. We’re building tools
              that make it easier to find your tribe, rally a crew, or just see
              who's down to hang out.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Real People, Real Plans
            </Typography>
            <Typography sx={{ color: "#aaa" }}>
              From entrepreneurs to artists, weekend warriors to lifelong
              learners — The Linkup brings like-minded people together in your
              city. Plans can be public, private, or somewhere in between.
            </Typography>
          </Box>
        </GridLayout>
      </Section>

      <Section sx={{ marginTop: 12 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          A platform built for presence
        </Typography>
        <Typography sx={{ color: "#aaa", maxWidth: 720 }}>
          We’re not about likes. We’re about <em>linkups</em>. On The Linkup,
          plans come to life, notifications guide your day, and conversations
          happen face to face.
        </Typography>
      </Section>

      <Section>
        <Footer>
          <FooterContent>
            <Typography>
              &copy; {new Date().getFullYear()} The Linkup Inc.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Link href="/privacy" underline="hover" color="inherit">
                Privacy Policy
              </Link>
              <Link href="/terms" underline="hover" color="inherit">
                Terms of Use
              </Link>
              <Link href="/contact" underline="hover" color="inherit">
                Contact
              </Link>
            </Box>
          </FooterContent>
        </Footer>
      </Section>
    </Root>
  );
}
