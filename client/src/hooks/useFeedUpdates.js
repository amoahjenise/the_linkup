// /luul/client/hooks/useFeedUpdates.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSockets } from "../contexts/SocketContext";
import {
  addLinkup,
  updateLinkup,
  removeLinkup,
} from "../redux/actions/linkupActions";
import { calculateDistance, calculateAge } from "../utils/utils";
import { customGenderOptions } from "../utils/customGenderOptions";

export const useFeedUpdates = () => {
  const dispatch = useDispatch();
  const { linkupManagementSocket } = useSockets();

  const user = useSelector((state) => state.loggedUser?.user);
  const userSettings = useSelector((state) => state.userSettings.userSettings);

  const userId = user?.id;
  const userLat = user?.latitude;
  const userLng = user?.longitude;
  const userGender = user?.gender;

  const isLinkupWithinUserSettings = (linkup) => {
    const ageRange = userSettings?.ageRange || [18, 99];
    const distanceRange = userSettings?.distanceRange || [0, 50];
    const genderPreferences = userSettings?.genderPreferences || [
      "men",
      "women",
      ...customGenderOptions.map((g) => g.toLowerCase()),
    ];

    const distance = calculateDistance(
      userLat,
      userLng,
      linkup.latitude,
      linkup.longitude
    );
    if (distance < distanceRange[0] || distance > distanceRange[1])
      return false;

    const age = calculateAge(linkup.date_of_birth) || 0;
    if (age < ageRange[0] || age > ageRange[1]) return false;

    if (
      genderPreferences.length > 0 &&
      !genderPreferences.includes(linkup.creator_gender?.toLowerCase())
    ) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!linkupManagementSocket) return;

    const handleLinkupCreated = ({ linkup }) => {
      if (
        linkup.creator_id === userId ||
        !linkup.gender_preference.includes(userGender) ||
        !isLinkupWithinUserSettings(linkup)
      ) {
        return;
      }
      dispatch(addLinkup(linkup));
    };

    const handleLinkupUpdated = ({ linkup }) => {
      if (!isLinkupWithinUserSettings(linkup)) return;
      dispatch(updateLinkup(linkup));
    };

    const handleLinkupDeleted = ({ linkup }) => {
      dispatch(removeLinkup(linkup.id)); // assuming linkup has `id`
    };

    linkupManagementSocket.on("linkupCreated", handleLinkupCreated);
    linkupManagementSocket.on("linkupUpdated", handleLinkupUpdated);
    linkupManagementSocket.on("linkupDeleted", handleLinkupDeleted);

    return () => {
      linkupManagementSocket.off("linkupCreated", handleLinkupCreated);
      linkupManagementSocket.off("linkupUpdated", handleLinkupUpdated);
      linkupManagementSocket.off("linkupDeleted", handleLinkupDeleted);
    };
  }, [
    linkupManagementSocket,
    dispatch,
    userId,
    userLat,
    userLng,
    userGender,
    userSettings,
  ]);
};
