import React from "react";
import { Skeleton, Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Card for the skeleton
const SkeletonCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const FeedSkeleton = () => {
  return (
    <Box>
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index}>
          <CardContent>
            {/* Title skeleton */}
            <Skeleton variant="text" width="60%" height={30} />

            {/* Subtitle skeleton */}
            <Skeleton
              variant="text"
              width="40%"
              height={20}
              style={{ marginTop: 8 }}
            />

            {/* Content skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={120}
              style={{ marginTop: 16 }}
            />
          </CardContent>
        </SkeletonCard>
      ))}
    </Box>
  );
};

export default FeedSkeleton;
