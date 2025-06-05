// hooks/useFeedItemUtils.js
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import nlp from "compromise";

const compromise = nlp;

const useFeedItemUtils = () => {
  const getTimeAgo = useCallback((createdAt) => {
    const now = moment();
    const created = moment(createdAt);
    const duration = moment.duration(now.diff(created));
    const days = duration.asDays();
    const hours = duration.asHours();
    const minutes = duration.asMinutes();

    if (days < 1) {
      if (hours >= 1) {
        return `${Math.floor(hours)} hour${
          Math.floor(hours) !== 1 ? "s" : ""
        } ago`;
      } else if (minutes >= 1) {
        return `${Math.floor(minutes)} minute${
          Math.floor(minutes) !== 1 ? "s" : ""
        } ago`;
      } else {
        return "Just now";
      }
    } else if (days >= 1 && days < 2) {
      return "Yesterday";
    } else if (days < 7) {
      return `${Math.floor(days)} day${Math.floor(days) !== 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  }, []);

  const capitalizeLocation = useCallback(
    (location) =>
      location
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    []
  );

  const formatActivityText = useCallback(
    (activity, creator_name, creator_id, formattedDate, UserNameClass) => {
      const doc = compromise(activity);
      const verbs = doc.verbs();
      const nouns = doc.nouns();
      const isPlural = nouns.some((noun) => noun.tag() === "Plural");
      const isGerund = activity.match(/\w+ing$/);
      const isNounHeavy = nouns.length >= verbs.length || isPlural;

      const activityFormatted = isGerund
        ? `for ${activity}`
        : isNounHeavy
        ? `for ${activity}`
        : `to ${activity}`;

      return (
        <p>
          <a
            style={{ fontWeight: 500 }}
            href={`/profile/${creator_id}`}
            className={UserNameClass}
          >
            {creator_name}
          </a>{" "}
          is trying to link up{" "}
          <span className="text-gray-200">{activityFormatted}.</span>
          {/* on{" "}
          <span style={{ fontWeight: 500 }}>{formattedDate}</span>. */}
        </p>
      );
    },
    []
  );

  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const useDistance = (loggedUser, latitude, longitude) => {
    const [distance, setDistance] = useState(null);

    useEffect(() => {
      if (loggedUser.latitude && loggedUser.longitude) {
        const userLat = loggedUser.latitude;
        const userLon = loggedUser.longitude;

        if (latitude && longitude) {
          const dist = calculateDistance(userLat, userLon, latitude, longitude);
          setDistance(dist.toFixed(0)); // Set distance with 0 decimal places
        } else {
          setDistance(null); // Handle cases where distance can't be calculated
        }
      }
    }, [latitude, loggedUser.latitude, loggedUser.longitude, longitude]);

    return distance;
  };

  const formatDate = (date) => moment(date).format("dddd, MMM D YYYY • h:mm A");

  return {
    getTimeAgo,
    capitalizeLocation,
    formatActivityText,
    useDistance,
    formatDate,
  };
};

export default useFeedItemUtils;
