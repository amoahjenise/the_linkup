import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser, shallowEqual);
  const [locationPermission, setLocationPermission] = useState("prompt");
  const [isIncognito, setIsIncognito] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const userIdRef = useRef(loggedUser?.user?.id);
  const lastLocation = useRef({ lat: null, lon: null });
  const watchIdRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const errorTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Update user reference when it changes
  useEffect(() => {
    userIdRef.current = loggedUser?.user?.id;
  }, [loggedUser?.user?.id]);

  // Check for incognito mode
  useEffect(() => {
    const checkIncognito = async () => {
      try {
        // More reliable incognito detection
        if (window.navigator.storage && window.navigator.storage.estimate) {
          const { quota } = await window.navigator.storage.estimate();
          setIsIncognito(quota < 120000000); // Typical incognito quota is ~110MB
        } else {
          // Fallback detection
          const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
          if (fs) {
            await new Promise((resolve) => {
              fs(
                window.TEMPORARY,
                100,
                () => resolve(false),
                () => resolve(true)
              );
            }).then(setIsIncognito);
          }
        }
      } catch {
        setIsIncognito(true);
      }
    };

    checkIncognito();
  }, []);

  // Check location permission status
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          setLocationPermission(permission.state);

          permission.onchange = () => {
            setLocationPermission(permission.state);
          };
        }
      } catch (error) {
        console.error("Permission API not supported", error);
      }
    };

    checkPermission();
  }, []);

  // Show permission modal if needed
  useEffect(() => {
    if (locationPermission === "prompt" && !showPermissionModal) {
      setShowPermissionModal(true);
    }
  }, [locationPermission, showPermissionModal]);

  // Location change detection with hysteresis
  const hasLocationChanged = useCallback((newLat, newLon) => {
    const { lat: prevLat, lon: prevLon } = lastLocation.current;
    if (prevLat === null || prevLon === null) return true;

    // Minimum distance threshold (in degrees)
    const threshold = 0.0005; // ~50 meters
    return (
      Math.abs(newLat - prevLat) > threshold ||
      Math.abs(newLon - prevLon) > threshold
    );
  }, []);

  // Optimized location saving with retry logic
  const saveLocation = useCallback(
    async (latitude, longitude) => {
      const now = Date.now();

      // Throttle updates to every 2 minutes unless significant movement
      if (
        now - lastUpdateTime.current < 120000 &&
        !hasLocationChanged(latitude, longitude)
      ) {
        return;
      }

      lastLocation.current = { lat: latitude, lon: longitude };
      lastUpdateTime.current = now;

      try {
        // Clear any pending error timeouts
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = null;
        }

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
          retryCountRef.current = 0; // Reset retry counter on success
        } else {
          throw new Error("Failed to fetch location");
        }
      } catch (error) {
        console.error("Location update error:", error);
        retryCountRef.current += 1;

        if (retryCountRef.current <= maxRetries) {
          // Exponential backoff for retries
          errorTimeoutRef.current = setTimeout(() => {
            saveLocation(latitude, longitude);
          }, Math.min(1000 * 2 ** retryCountRef.current, 30000)); // Max 30s delay
        } else {
          console.warn("Max retries reached for location update");
          retryCountRef.current = 0;
        }
      }
    },
    [dispatch, hasLocationChanged]
  );

  // Main geolocation watcher
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    if (isIncognito) {
      console.warn("Incognito mode detected - location services limited");
      return;
    }

    if (locationPermission === "denied") {
      console.warn("Location permission denied");
      return;
    }

    const watchOptions = {
      enableHighAccuracy: false, // Better battery life
      maximumAge: 300000, // 5 minutes cache
      timeout: 15000, // 15 second timeout
    };

    const handlePosition = (position) => {
      const { latitude, longitude } = position.coords;
      saveLocation(latitude, longitude);
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);

      // Don't show immediate alerts - we'll handle this through UI components
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationPermission("denied");
          break;
        case error.POSITION_UNAVAILABLE:
          console.warn("Location information unavailable");
          break;
        case error.TIMEOUT:
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current += 1;
            setTimeout(() => {
              navigator.geolocation.getCurrentPosition(
                handlePosition,
                handleError,
                watchOptions
              );
            }, 1000 * retryCountRef.current);
          }
          break;
        default:
          console.warn("Unknown geolocation error");
      }
    };

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      watchOptions
    );

    // Initial position request
    navigator.geolocation.getCurrentPosition(
      handlePosition,
      handleError,
      watchOptions
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [saveLocation, isIncognito, locationPermission]);

  // Return state for UI components to handle permission requests
  return {
    locationPermission,
    isIncognito,
    showPermissionModal,
    requestPermission: () => {
      // This would trigger the browser's native permission prompt
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission("granted"),
        () => setLocationPermission("denied"),
        { enableHighAccuracy: false }
      );
      setShowPermissionModal(false);
    },
    dismissPermissionModal: () => setShowPermissionModal(false),
  };
};

export default useLocationUpdate;
