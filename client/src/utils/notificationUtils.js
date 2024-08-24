// notificationUtils.js

export const requestNotificationPermission = () => {
  // This should be triggered by a user gesture
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      })
      .catch((error) => {
        console.error("Failed to request notification permission:", error);
      });
  }
};

// export const playSound = () => {
//   const audio = new Audio("/path-to-sound.mp3"); // Add the path to your sound file
//   audio.play().catch(error => {
//     console.error("Failed to play sound:", error);
//   });
// };

export const showNotification = (title, body) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: body,
      icon: "/logo.png",
    });

    // Uncomment to play sound when the notification is shown
    // playSound();

    notification.onclick = function () {
      window.focus();
      this.close();
    };
  } else {
    console.warn("Notification permission not granted.");
  }
};
