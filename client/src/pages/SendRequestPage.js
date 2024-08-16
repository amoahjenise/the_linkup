import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SendRequestSection from "../components/SendRequestSection";
import { useColorMode } from "@chakra-ui/react";

// Styled Components
const SendRequestPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  width: "50%",
  [theme.breakpoints.down("md")]: {
    width: "100%", // Set to 100% in mobile mode
  },
}));

const SendRequestPage = () => {
  const { linkupId } = useParams(); // Get the postId parameter from the URL
  const linkups = useSelector((state) => state.linkups);
  const { colorMode } = useColorMode();

  return (
    <SendRequestPageContainer>
      <SendRequestSection
        linkupId={linkupId}
        linkups={linkups.linkupList}
        colorMode={colorMode}
      />
    </SendRequestPageContainer>
  );
};

export default SendRequestPage;
