// utils/linkupFiltering.js
import { differenceInYears } from "date-fns";

export function filterLinkupsByUserPreferences(linkups, userId, settings) {
  const { distanceRange, ageRange, genderPreferences } = settings;

  return linkups.filter((linkup) => {
    if (linkup.creator_id === userId) return false;

    const { date_of_birth, creator_gender, latitude, longitude } = linkup;

    // Gender match
    if (
      genderPreferences &&
      !genderPreferences.includes(creator_gender.toLowerCase())
    )
      return false;

    // Age match
    if (date_of_birth && ageRange?.length === 2) {
      const age = differenceInYears(new Date(), new Date(date_of_birth));
      if (age < ageRange[0] || age > ageRange[1]) return false;
    }
    // Distance match (if coords exist)
    if (
      latitude &&
      longitude &&
      distanceRange &&
      linkup.distance !== undefined
    ) {
      if (linkup.distance > distanceRange) return false;
    }

    return true;
  });
}
