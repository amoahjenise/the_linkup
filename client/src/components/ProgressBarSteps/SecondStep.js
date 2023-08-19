import React from "react";
import AvatarUploadInput from "../AvatarUploadInput";

const SecondStep = ({ avatarURL, setAvatarURL }) => {
  return (
    <div>
      <AvatarUploadInput avatarURL={avatarURL} setAvatarURL={setAvatarURL} />
    </div>
  );
};

export default SecondStep;
