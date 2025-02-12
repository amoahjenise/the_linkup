import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser, shallowEqual);
  const lastLocation = useRef({ lat: null, lon: null });
  const watchIdRef = useRef(null);

  const hasLocationChanged = (newLat, newLon) => {
    const threshold = 0.001;
    const prevLat = lastLocation.current.lat;
    const prevLon = lastLocation.current.lon;

    return (
      Math.abs(newLat - prevLat) > threshold ||
      Math.abs(newLon - prevLon) > threshold
    );
  };

  useEffect(() => {
    if (!navigator.geolocation || !loggedUser?.user?.id || watchIdRef.current) {
      return; // Exit if conditions are not met
    }

    const saveLocation = async (latitude, longitude) => {
      try {
        if (hasLocationChanged(latitude, longitude)) {
          lastLocation.current = { lat: latitude, lon: longitude };

          const resultAction = await dispatch(
            fetchLocation({ lat: latitude, lon: longitude })
          );

          if (fetchLocation.fulfilled.match(resultAction)) {
            const resultPostLocation = await postLocation(
              loggedUser.user.id,
              resultAction.payload.city,
              resultAction.payload.country,
              latitude,
              longitude,
              true
            );

            dispatch(updateCurrentUser(resultPostLocation.user));
          } else {
            console.error("Failed to fetch location:", resultAction.error);
          }
        }
      } catch (error) {
        console.error("Error fetching or posting location:", error);
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        saveLocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [dispatch, loggedUser?.user?.id]);

  return null;
};

export default useLocationUpdate;
