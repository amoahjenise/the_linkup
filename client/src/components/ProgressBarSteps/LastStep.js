import React from "react";

const LastStep = ({ userData }) => {
  console.log("Last Step userData: ", userData);

  // Extract the name from the userData object
  const name = userData.name;

  // Convert the first character to uppercase and the rest to lowercase
  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Personalized welcome message using the formatted first name
  const welcomeMessage = `Let's get started, ${formattedName}!`;

  return (
    <>
      <h2>{welcomeMessage}</h2>
    </>
  );
};

export default LastStep;
