import React from "react";
// import { useDispatch } from "react-redux";
// import SearchInput from "./SearchInputWidget";
import CreateLinkupForm from "./CreateLinkupWidget";
import { styled } from "@mui/material/styles";
// import { searchLinkups } from "../api/linkUpAPI";
// import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
// import debounce from "lodash/debounce"; // Import debounce function from lodash
import CategoryWidget from "./CategoryWidget";

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
  // userId,
  // gender,
}) => {
  // const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  // // Persist debounced function using useRef to avoid recreation
  // const debounceSearchRef = useRef(
  //   debounce(async (value) => {
  //     setLoading(true);
  //     try {
  //       const response = await searchLinkups(value, userId, gender);
  //       dispatch(fetchLinkupsSuccess(response.linkupList));
  //     } catch (error) {
  //       console.error("Error fetching linkups:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 300)
  // );

  // // Function to handle input change and trigger search
  // const handleInputChange = (event) => {
  //   debounceSearchRef.current(event.target.value);
  // };

  const handleFilterChange = (selectedCategories) => {
    console.log("Selected Categories:", selectedCategories);
    // Apply filter logic to the feed based on selectedCategories
  };

  return (
    <WidgetSectionContainer>
      {/* Search Input Component */}
      {/* <Widget>
        <SearchInput handleInputChange={handleInputChange} loading={loading} />
      </Widget> */}

      {/* Create Linkup Component */}
      <Widget>
        <CreateLinkupForm
          setIsWidgetVisible={setIsWidgetVisible}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTopCallback}
        />
      </Widget>

      {/* <Widget>
        <CategoryWidget onFilterChange={handleFilterChange} />
      </Widget> */}
    </WidgetSectionContainer>
  );
};

export default WidgetSection;
