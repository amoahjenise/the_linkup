import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../redux/reducers/locationSlice";
import { postLocation } from "../api/locationAPI";
import { updateCurrentUser } from "../redux/actions/userActions";

const useLocationUpdate = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);

  const updateLocation = async (shareLocation) => {
    if (navigator.geolocation) {
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
              // Now that the location state is updated, call postLocation
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
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  };

  return { updateLocation };
};

export default useLocationUpdate;
