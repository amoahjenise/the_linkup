import React from "react";

const FirstStep = ({
  name,
  dateOfBirth,
  gender,
  setName,
  setDateOfBirth,
  setGender,
}) => {
  return (
    <div className="form">
      <label htmlFor="name">First Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Add your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="dateOfBirth">Date of Birth</label>
      <input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        max={new Date().toISOString().split("T")[0]} // Set max date to today
        required
      />

      <label htmlFor="gender">Gender</label>
      <select
        id="gender"
        name="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
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
