import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import SearchInput from "./SearchInputWidget";
import WhatWouldYouLikeWidget from "./WhatWouldYouLikeWidget";
import CreateLinkupForm from "./CreateLinkupWidget";
import { styled } from "@mui/material/styles";
import { searchLinkups } from "../api/linkUpAPI";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import debounce from "lodash/debounce"; // Import debounce function from lodash

const WidgetSectionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
}));

const Widget = styled("div")(({ theme }) => ({
  width: "95%",
  marginBottom: theme.spacing(2), // Spacing between widgets
}));

const WidgetSection = ({
  setIsWidgetVisible,
  setShouldFetchLinkups,
  scrollToTopCallback,
  userId,
  gender,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Function to handle input change and trigger search with debounce
  const handleInputChange = (event) => {
    setLoading(true);
    // Call debounceSearchLinkups function to prevent multiple API calls
    debounceSearchLinkups(event.target.value);
  };

  // Debounce searchLinkups function to prevent multiple API calls
  const debounceSearchLinkups = useCallback(
    debounce((value) => {
      searchLinkups(value, userId, gender)
        .then((response) => {
          if (response.linkupList.length > 0)
            dispatch(fetchLinkupsSuccess(response.linkupList));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }, 300),
    [userId, gender, dispatch] // Dependencies adjusted for correct effect
  );

  return (
    <WidgetSectionContainer>
      {/* Search Input Component */}
      <Widget>
        <SearchInput handleInputChange={handleInputChange} />
      </Widget>

      {/* What would you like Component */}
      {/* <Widget>
        <WhatWouldYouLikeWidget onSubmitSuggestion={onSubmitSuggestion} />
      </Widget> */}

      {/* Create Linkup Component */}
      <Widget>
        <CreateLinkupForm
          setIsWidgetVisible={setIsWidgetVisible}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTopCallback}
        />
      </Widget>
    </WidgetSectionContainer>
  );
};

export default WidgetSection;
