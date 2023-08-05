import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRegistrationData } from "../../redux/reducers/registrationReducer";

const FirstStep = () => {
  const registrationData = useSelector(
    (state) => state.registration.registrationData
  );
  const dispatch = useDispatch();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(updateRegistrationData({ [name]: value }));
    },
    [dispatch]
  );

  return (
    <div className="form">
      <label>First Name</label>
      <input
        autoComplete="off"
        type="text"
        name="firstName"
        placeholder="Add your first name"
        value={registrationData.firstName}
        onChange={handleChange}
      />

      <label htmlFor="dateOfBirth">Date of Birth</label>
      <input
        autoComplete="off"
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={registrationData.dateOfBirth}
        onChange={handleChange}
      />

      <label htmlFor="gender">Gender</label>
      <select
        autoComplete="off"
        id="gender"
        name="gender"
        value={registrationData.gender}
        onChange={handleChange}
      >
        <option value="">--Select--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-Binary</option>
      </select>
    </div>
  );
};

export default FirstStep;
