import { useEffect, useRef } from "react";
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
    const { lat: prevLat, lon: prevLon } = lastLocation.current;

    if (prevLat === null || prevLon === null) return true; // First-time location

    return (
      Math.abs(newLat - prevLat) > threshold ||
      Math.abs(newLon - prevLon) > threshold
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is either disabled or not supported by your browser. Please enable location services in your browser settings and try again."
      );
      return;
    }

    if (!loggedUser?.user?.id || watchIdRef.current !== null) return;

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

        let errorMessage =
          "An unknown location error occurred. Please try again.";
        if (error.code === 1) {
          errorMessage =
            "Location access was denied. Please enable location permissions in your browser settings.";
        } else if (error.code === 2) {
          errorMessage = "Location is unavailable. Try again later.";
        } else if (error.code === 3) {
          errorMessage =
            "Location request timed out. Please refresh and try again.";
        }

        alert(`Error getting location: ${error.message}\n${errorMessage}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [dispatch, loggedUser?.user?.id]);

  return null;
};

export default useLocationUpdate;
