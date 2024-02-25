import React from "react";

const FirstStep = ({ userData, setUserData }) => {
  console.log("First Step userData: ", userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  return (
    <div className="form">
      <label htmlFor="name">First Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Add your first name"
        value={userData.name}
        onChange={handleChange}
        required
        className="custom-input"
      />

      <label htmlFor="dateOfBirth">Date of Birth</label>
      <input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={userData.dateOfBirth}
        onChange={handleChange}
        max={new Date().toISOString().split("T")[0]} // Set max date to today
        required
        className="custom-input"
      />

      <label htmlFor="gender">Gender</label>
      <select
        id="gender"
        name="gender"
        value={userData.gender}
        onChange={handleChange}
        required
        className="custom-input"
      >
        <option value="">--Select--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  );
};

export default FirstStep;
