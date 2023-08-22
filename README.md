# luul
LUUL React App Repository

---

## App Description

This React web application aims to provide users with a platform to create, browse, and interact with linkup events. A linkup event represents an organized activity with attributes such as activity type, date/time, location, and gender preference. Users can create, update, and delete their own linkup events. The app fosters communication between users through a messaging system and facilitates the scheduling and coordination of linkup events.

### Key Features

- **Linkup Creation and Management:**
  - Users can create linkup events with details including activity type, date/time, location, and gender preference.
  - Linkup creators can update and delete their own linkup events.
  
- **Home Page Feed:**
  - The home page displays a feed of linkup events based on the user's gender preference.
  - Users can browse and view details of linkup events.
  
- **Messaging System:**
  - Users can exchange messages related to specific linkup events.
  - Conversations are organized and linked to the relevant linkup events.
  
- **Notification System:**
  - Creators of linkup events receive notifications for new messages and participation requests.
  
- **Requesting Participation:**
  - Users interested in a linkup event can send participation requests along with messages to the event creator.
  
- **Accepting and Initializing Linkups:**
  - Linkup creators can accept participation requests and initialize linkups.
  - The app sets reminders for both parties regarding the scheduled linkup event.
  
### Project Structure

The project follows a modular structure for maintainability:

- `client/`: Contains the frontend code of the React web application.
- `server/`: Houses the backend services for various functionalities such as authentication, user management, linkup management, messaging, and notifications.
- `client/src/`: Contains the frontend components, pages, and context related to the app's user interface.
- `server/xxx-service/`: Represents individual backend services responsible for specific functionalities.

For a more detailed overview of the project structure, refer to the provided directory tree at the end of this readme.

### Collaboration and Support

This app is designed to facilitate social interactions through organized linkup events. It is intended to serve as a foundation for enhancing user engagement and community building. The well-organized project structure and modular design aim to make ongoing development, maintenance, and feature expansion efficient and scalable.

For any inquiries, contributions, or support requests, please refer to the documentation and codebase available in this repository. We welcome collaboration from the developer community to help further improve and expand the capabilities of this app.

---

App structure:

luul/
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   ├── src/
│   │   ├── api/
│   │   │   ├── authenticationAPI.js
│   │   │   ├── linkupAPI.js
│   │   │   ├── linkupRequestAPI.js
│   │   │   ├── notificationAPI.js
│   │   │   ├── usersAPI.js
│   │   │   ├── ...
│   │   ├── contexts/
│   │   │   │   ├── SnackbarContext.js
│   │   ├── redux/
│   │   │   │   ├── actions/
│   │   │   │   │   ├── actionTypes.js
│   │   │   │   │   ├── authActions.js
│   │   │   │   │   ├── conversationActions.js
│   │   │   │   │   ├── editingLinkupActions.js
│   │   │   │   │   ├── linkupActions.js
│   │   │   │   │   ├── userActions.js
│   │   │   │   │   ├── ...
│   │   │   │   ├── reducers/
│   │   │   │   │   ├── authReducer.js
│   │   │   │   │   ├── conversationReducer.js
│   │   │   │   │   ├── editingLinkupReducer.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── linkupReducer.js
│   │   │   │   │   ├── userReducer.js
│   │   │   │   │   ├── ...
│   │   ├── components/
│   │   │   ├── MultiStepProgressBar/
│   │   │   │   │   ├── MultiStepProgressBar.css
│   │   │   │   │   ├── MultiStepProgressBar.js
│   │   │   ├── ProgressBarSteps/
│   │   │   │   │   ├── FirstStep.js
│   │   │   │   │   ├── SecondStep.js
│   │   │   │   │   ├── ThirdStep.js
│   │   │   │   │   ├── LastStep.js
│   │   │   │   ├── AvatarUpdate.js
│   │   │   │   ├── AvatarUploadInput.js
│   │   │   │   ├── Cards.js
│   │   │   │   ├── ChatComponent.js
│   │   │   │   ├── ChatInput.js
│   │   │   │   ├── CreateLinkupForm.js
│   │   │   │   ├── DeactivateAccount.js
│   │   │   │   ├── EditLinkupForm.js
│   │   │   │   ├── EmptyFeedPlaceholder.js
│   │   │   │   ├── FeedSection.js
│   │   │   │   ├── Footer.js
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   ├── Hero.js
│   │   │   │   ├── LeftMenu.js
│   │   │   │   ├── LinkupHistoryItem.js
│   │   │   │   ├── LinkupItem.js
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── LogoHeader.js
│   │   │   │   ├── Messages.js
│   │   │   │   ├── MessagesSection.js
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── NotificationItem.js
│   │   │   │   ├── Notifications.js
│   │   │   │   ├── PhoneVerification.js
│   │   │   │   ├── RegistrationProcess.js
│   │   │   │   ├── SendRequest.js
│   │   │   │   ├── SendRequestSection.js
│   │   │   │   ├── Settings.js
│   │   │   │   ├── TopNavBar.js
│   │   │   │   ├── UserAuthentication.js
│   │   │   │   ├── ...
│   │   ├── pages/
│   │   │   │   ├── AcceptDeclinePage.js
│   │   │   │   ├── HomePage.js
│   │   │   │   ├── LandingPage.js
│   │   │   │   ├── LinkUpHistoryPage.js
│   │   │   │   ├── LoginPage.js
│   │   │   │   ├── MessagesPage.js
│   │   │   │   ├── NotificationsPage.js
│   │   │   │   ├── SelectedMessagePage.js
│   │   │   │   ├── SettingsPage.js
│   │   │   │   ├── SignupPage.js
│   │   │   │   ├── UserProfilePage.js
│   │   │   │   ├── ...
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.png
│   │   ├── ...
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
├── node_modules/
├── server/
│   ├── node_modules/
│   ├── activity-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── auth-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── image-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── link-up-management-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── link-up-request-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── messaging-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── notification-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── user-management-service/
│   │   ├── controllers/
│   │   │   ├── controller.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   ├── db/queries/
│   │   │   ├── file.sql
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── socket/
│   │   │   ├── socket.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── .gitignore
├── package.json
├── package-lock.json
├── .gitignore
├── README.md

