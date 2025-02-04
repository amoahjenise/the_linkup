import React from "react";
import axios from "axios";

const NotificationTestPage = () => {
  const simulateNotification = async () => {
    try {
      // Convert test strings to UUID format
      const requesterId = "6b1c6e79-6f0a-44b4-b914-7182af4d1945";
      const creatorId = "c310bc34-7827-4793-a357-ee4d0b341789";
      const linkupId = "5dba8751-dbb8-42a7-9888-092bb6256fe5";
      const requesterName = "Latifa";
      const content = "Hey! I'm interested!";

      // Send a POST request to your backend server to emit the "linkup-requested" event
      const response = await axios.post(
        `http://localhost:5004/api/send-request`,
        {
          requesterId: requesterId,
          requesterName: requesterName,
          creator_id: creatorId,
          linkupId: linkupId,
          content: content,
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error simulating notification:", error);
    }
  };

  return (
    <div>
      <h1>Notification Test</h1>
      <button onClick={simulateNotification}>Simulate Notification</button>
    </div>
  );
};

export default NotificationTestPage;
