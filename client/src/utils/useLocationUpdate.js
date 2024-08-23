import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);

  const updateLocation = async (shareLocation) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your device.");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        alert(
          "Location access is denied. Please enable it in your device settings."
        );
        return;
      }

      if (permission.state === "granted" || permission.state === "prompt") {
        requestGeolocation(shareLocation);
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      alert("There was an error accessing location services.");
    }
  };

  const requestGeolocation = (shareLocation) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resultAction = await dispatch(
            fetchLocation({
              lat: latitude,
              lon: longitude,
              allow_location: shareLocation,
            })
          );

          if (fetchLocation.fulfilled.match(resultAction)) {
            const resultPostLocation = await postLocation(
              loggedUser.user.id,
              resultAction.payload.city,
              resultAction.payload.country,
              latitude,
              longitude,
              shareLocation
            );

            dispatch(updateCurrentUser(resultPostLocation.user));
          } else {
            console.error("Failed to fetch location:", resultAction.error);
          }
        } catch (error) {
          console.error("Error fetching or posting location:", error);
        }
      },
      (error) => {
        handleGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const handleGeolocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert(
          "Location access denied. Please enable it in your device settings."
        );
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable. Please try again later.");
        break;
      case error.TIMEOUT:
        alert("The request to get your location timed out. Please try again.");
        break;
      default:
        alert("An unknown error occurred while fetching your location.");
        break;
    }
  };

  return { updateLocation };
};

export default useLocationUpdate;
