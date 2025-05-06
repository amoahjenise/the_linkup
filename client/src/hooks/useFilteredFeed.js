import { useMemo } from "react";
import { useSelector } from "react-redux";

// useFilteredFeed.js
const useFilteredFeed = (rawFeed, userId) => {
  const { userSettings } = useSelector((state) => state.userSettings);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const { distanceRange, ageRange, genderPreferences } = useMemo(
    () => ({
      distanceRange: userSettings?.distanceRange || [0, 1000],
      ageRange: userSettings?.ageRange || [18, 99],
      genderPreferences: userSettings?.genderPreferences || [],
    }),
    [userSettings]
  );

  const filteredFeed = useMemo(() => {
    return rawFeed.filter((linkup) => {
      if (linkup.creator_id === userId) return true;

      const distance = linkup.distance || 0;
      const age = calculateAge(linkup.date_of_birth) || 0;
      const genderMatch =
        genderPreferences.length === 0 ||
        genderPreferences.includes(linkup.creator_gender?.toLowerCase());

      return (
        distance >= distanceRange[0] &&
        distance <= distanceRange[1] &&
        age >= ageRange[0] &&
        age <= ageRange[1] &&
        genderMatch
      );
    });
  }, [rawFeed, userId, distanceRange, ageRange, genderPreferences]);

  return filteredFeed;
};

export default useFilteredFeed;
