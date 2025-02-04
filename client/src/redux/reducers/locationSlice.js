import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = process.env.REACT_APP_LOCATION_SERVICE_API_KEY;

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async ({ lat, lon, allow_location }) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    return {
      allow_location: allow_location,
      city: response.data.name,
      country: response.data.sys.country,
      error: "",
    };
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    city: "",
    country: "",
    allow_location: "",
    status: "idle",
    error: null,
  },
  reducers: {
    // Define your reducers here
    updateLocationSharing(state, action) {
      state.allow_location = action.payload;
      state.status = "";
      if (!state.allow_location) {
        state.city = "";
      }
      if (!state.allow_location) {
        state.country = "";
      }
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.city = action.payload.city;
        state.country = action.payload.country;
        state.allow_location = action.payload.allow_location;
        state.error = "";
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateLocationSharing } = locationSlice.actions;
export default locationSlice.reducer;
