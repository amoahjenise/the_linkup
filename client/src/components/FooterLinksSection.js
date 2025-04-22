import React from "react";
import { styled } from "@mui/material/styles";

// Styled components using MUI's styled (object syntax)
const FooterLinksContainer = styled("nav")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "1rem 0",
  fontSize: "14px",
  color: "rgb(113, 118, 123)",
  borderTop: "1px solid #2f3336",
  marginTop: 8,
}));

const FooterLink = styled("a")(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Divider = styled("span")(({ theme }) => ({
  margin: "0 4px",
  color: "inherit",
}));

const FooterLinksSection = () => {
  const links = [
    { href: "/about", label: "About" },
    // { href: "/help-centre", label: "Help Centre" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/cookie-use", label: "Cookie Policy" },
    // { href: "/accessibility", label: "Accessibility" },
  ];

  return (
    <FooterLinksContainer aria-label="Footer" role="navigation">
      {links.map((link, index) => (
        <React.Fragment key={link.href}>
          <FooterLink
            href={link.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            {link.label}
          </FooterLink>
          {index < links.length - 1 && <Divider>|</Divider>}
        </React.Fragment>
      ))}
    </FooterLinksContainer>
  );
};

export default FooterLinksSection;
