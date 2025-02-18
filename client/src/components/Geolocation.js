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
  const retryCount = useRef(0);
  const maxRetries = 3;
  const [highAccuracy, setHighAccuracy] = useState(true);

  const locationThreshold = 0.001; // Minimum location change to trigger an update

  const hasLocationChanged = (newLat, newLon) => {
    const { lat: prevLat, lon: prevLon } = lastLocation.current;

    if (prevLat === null || prevLon === null) return true; // First-time location
    return (
      Math.abs(newLat - prevLat) > locationThreshold ||
      Math.abs(newLon - prevLon) > locationThreshold
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser. Please enable location services."
      );
      return;
    }

    if (!loggedUser?.user?.id || watchIdRef.current !== null) return;

    const saveLocation = async (latitude, longitude) => {
      if (!hasLocationChanged(latitude, longitude)) return; // Skip if location hasn't changed significantly

      lastLocation.current = { lat: latitude, lon: longitude };

      try {
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
          retryCount.current = 0; // Reset retry count after successful update
        } else {
          console.error("Failed to fetch location:", resultAction.error);
        }
      } catch (error) {
        console.error("Error fetching or posting location:", error);
      }
    };

    const handleLocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      saveLocation(latitude, longitude);
    };

    const handleLocationError = (error) => {
      console.error("Error getting location:", error);

      if (error.code === 1) {
        alert(
          "Location access denied. Please enable location permissions in your browser settings."
        );
      } else if (error.code === 2) {
        alert("Location is unavailable. Try again later.");
      } else if (error.code === 3) {
        console.warn("Location request timed out. Retrying...");

        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
              handleLocationSuccess,
              handleLocationError,
              {
                enableHighAccuracy: highAccuracy,
                maximumAge: 30000,
                timeout: 10000,
              }
            );
          }, 2000);
        } else {
          console.error("Max retries reached. Disabling high accuracy.");
          setHighAccuracy(false); // Disable high accuracy to prevent further timeouts
        }
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: highAccuracy,
        maximumAge: 30000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [dispatch, loggedUser?.user?.id, highAccuracy]);

  return null;
};

export default useLocationUpdate;
