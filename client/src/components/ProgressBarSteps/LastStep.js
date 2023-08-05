import React from "react";
import { useSelector } from "react-redux";

const LastStep = () => {
  const registrationData = useSelector(
    (state) => state.registration.registrationData
  );

  // Get the first name from the registration data
  const firstName = registrationData.firstName || "";

  // Convert the first character to uppercase and the rest to lowercase
  const formattedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  // Personalized welcome message using the formatted first name
  const welcomeMessage = `Let's get started, ${formattedFirstName}!`;

  return (
    <>
      <h2>{welcomeMessage}</h2>
    </>
  );
};

export default LastStep;
