import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser, shallowEqual);
  const [isIncognito, setIsIncognito] = useState(false);

  const userIdRef = useRef(loggedUser?.user?.id);
  const lastLocation = useRef({ lat: null, lon: null });
  const watchIdRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const displayedErrors = useRef(new Set()); // Track displayed errors
  const incognitoAlertShown = useRef(false); // Track if Incognito alert has been shown

  useEffect(() => {
    if (loggedUser?.user?.id) {
      userIdRef.current = loggedUser.user.id;
    }
  }, [loggedUser?.user?.id]);

  const detectIncognito = async () => {
    try {
      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) return false;

      return new Promise((resolve) => {
        fs(
          window.TEMPORARY,
          100,
          () => resolve(false),
          () => resolve(true)
        );
      });
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const detectIncognitoMode = async () => {
      const result = await detectIncognito();
      setIsIncognito(result);
    };

    detectIncognitoMode();
  }, []); // Ensure this effect runs only once during initial mount.

  const hasLocationChanged = useCallback((newLat, newLon) => {
    const threshold = 0.001;
    const { lat: prevLat, lon: prevLon } = lastLocation.current;

    if (prevLat === null || prevLon === null) return true;
    return (
      Math.abs(newLat - prevLat) > threshold ||
      Math.abs(newLon - prevLon) > threshold
    );
  }, []);

  const saveLocation = useCallback(
    async (latitude, longitude) => {
      const now = Date.now();
      if (now - lastUpdateTime.current < 30000) return; // Limit updates

      if (hasLocationChanged(latitude, longitude)) {
        lastLocation.current = { lat: latitude, lon: longitude };
        lastUpdateTime.current = now;

        try {
          const resultAction = await dispatch(
            fetchLocation({ lat: latitude, lon: longitude })
          );

          if (fetchLocation.fulfilled.match(resultAction)) {
            const resultPostLocation = await postLocation(
              userIdRef.current,
              resultAction.payload.city,
              resultAction.payload.country,
              latitude,
              longitude,
              true
            );

            dispatch(updateCurrentUser(resultPostLocation.user));
          } else {
            console.error("Failed to fetch location:", resultAction.error);
            const errorMsg = "Failed to update location. Please try again.";
            if (!displayedErrors.current.has(errorMsg)) {
              alert(errorMsg);
              displayedErrors.current.add(errorMsg);
            }
          }
        } catch (error) {
          console.error("Error updating location:", error);
          const errorMsg = "Failed to update location. Please try again.";
          if (!displayedErrors.current.has(errorMsg)) {
            alert(errorMsg);
            displayedErrors.current.add(errorMsg);
          }
        }
      }
    },
    [dispatch, hasLocationChanged]
  );

  useEffect(() => {
    if (isIncognito && !incognitoAlertShown.current) {
      alert("Geolocation is blocked in Incognito Mode. Try using normal mode.");
      incognitoAlertShown.current = true; // Mark the alert as shown
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const checkPermissionAndWatch = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "denied") {
          alert(
            "Location access is denied. If you're in Incognito Mode, switch to normal mode."
          );
          return;
        }

        if (!userIdRef.current || watchIdRef.current !== null) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            saveLocation(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);

            let errorMessage = "An unknown location error occurred.";
            if (error.code === 1)
              errorMessage =
                "Location access was denied. Check browser settings or exit Incognito Mode.";
            else if (error.code === 2)
              errorMessage = "Location is unavailable.";
            else if (error.code === 3)
              errorMessage = "Location request timed out.";

            if (!displayedErrors.current.has(errorMessage)) {
              alert(errorMessage);
              displayedErrors.current.add(errorMessage);
            }
          },
          {
            enableHighAccuracy: false,
            maximumAge: 60000,
            timeout: 10000,
          }
        );
      } catch (err) {
        console.error("Error checking location permissions:", err);
      }
    };

    checkPermissionAndWatch();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [saveLocation, isIncognito]);

  return null;
};

export default useLocationUpdate;
