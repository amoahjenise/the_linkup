import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";

// Sample categories (you can replace this with your own data)
const categories = [
  { id: 1, name: "Sports", color: "#0097A7" },
  { id: 2, name: "Music", color: "#0097A7" },
  { id: 3, name: "Food", color: "#0097A7" },
  { id: 4, name: "Tech", color: "#0097A7" },
  { id: 5, name: "Travel", color: "#0097A7" },
  { id: 6, name: "Art", color: "#0097A7" },
  { id: 7, name: "Fitness", color: "#0097A7" },
  { id: 8, name: "Gaming", color: "#0097A7" },
  { id: 9, name: "Networking", color: "#0097A7" },
  { id: 10, name: "Outdoor Adventures", color: "#0097A7" },
  { id: 11, name: "Parties & Nightlife", color: "#0097A7" },
  { id: 12, name: "Events", color: "#0097A7" },
  { id: 13, name: "Movies", color: "#0097A7" },
  { id: 14, name: "Wellness & Meditation", color: "#0097A7" },
  { id: 15, name: "Business & Entrepreneurship", color: "#0097A7" },
  { id: 16, name: "Photography", color: "#0097A7" },
];

const CategoryWidget = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { colorMode } = useColorMode(); // Use Chakra UI's color mode

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      // Remove category if already selected
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      // Add category if not selected
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Notify parent component about filter changes
  React.useEffect(() => {
    onFilterChange(selectedCategories);
  }, [selectedCategories, onFilterChange]);

  return (
    <Box
      sx={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 3,
        borderRadius: "24px",
        borderWidth: "1px",
        transition: "box-shadow 0.3s ease",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
        backgroundColor:
          colorMode === "dark" ? "rgba(200, 200, 200, 0.1)" : "white",
      }}
    >
      <Typography variant="h6" color="#0097A7" gutterBottom>
        Filter by Category
      </Typography>
      <Box display="flex" flexWrap="wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={
              selectedCategories.includes(category.id)
                ? "contained"
                : "outlined"
            }
            sx={{
              margin: 0.5,
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: selectedCategories.includes(category.id)
                ? category.color
                : "#F0F0F0",
              color: selectedCategories.includes(category.id)
                ? "#FFFFFF"
                : "#000000",
              borderColor: category.color,
              "&:hover": {
                backgroundColor: selectedCategories.includes(category.id)
                  ? category.color
                  : "#E0E0E0",
              },
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryWidget;
