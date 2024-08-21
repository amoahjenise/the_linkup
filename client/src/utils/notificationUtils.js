// notificationUtils.js

export const requestNotificationPermission = () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

// export const playSound = () => {
//   const audio = new Audio("path-to-sound.mp3"); // Add the path to your sound file
//   audio.play();
// };

export const showNotification = (title, body) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: body,
      icon: "/logo.png",
    });

    // playSound();

    notification.onclick = function () {
      window.focus();
      this.close();
    };
  }
};
