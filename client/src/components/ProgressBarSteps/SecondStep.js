import React from "react";
import AvatarUploadInput from "../AvatarUploadInput";

const SecondStep = ({ userData, setUserData }) => {
  console.log("Second Step userData: ", userData);

  return (
    <div>
      <AvatarUploadInput userData={userData} setUserData={setUserData} />
    </div>
  );
};

export default SecondStep;
