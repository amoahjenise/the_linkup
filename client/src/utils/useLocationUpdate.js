import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);

  const updateLocation = async (shareLocation) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch location data
          const resultAction = await dispatch(
            fetchLocation({
              lat: latitude,
              lon: longitude,
              allow_location: shareLocation,
            })
          );

          if (fetchLocation.fulfilled.match(resultAction)) {
            // Post location data
            const resultPostLocation = await postLocation(
              loggedUser.user.id,
              resultAction.payload.city,
              resultAction.payload.country,
              latitude,
              longitude,
              shareLocation
            );

            // Update user with new location info
            dispatch(updateCurrentUser(resultPostLocation.user));
          } else {
            console.error("Failed to fetch location:", resultAction.error);
          }
        } catch (error) {
          console.error("Error fetching or posting location:", error);
        }
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
      },
      {
        // Optional: You can set specific options for geolocation
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return { updateLocation };
};

export default useLocationUpdate;
