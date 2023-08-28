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

### Collaboration and Support

This app is designed to facilitate social interactions through organized linkup events. It is intended to serve as a foundation for enhancing user engagement and community building. The well-organized project structure and modular design aim to make ongoing development, maintenance, and feature expansion efficient and scalable.

For any inquiries, contributions, or support requests, please refer to the documentation and codebase available in this repository. We welcome collaboration from the developer community to help further improve and expand the capabilities of this app.

---


---


# Linkup App Documentation

## Introduction

Welcome to the documentation for the Linkup app, a platform that enables users to create, manage, and participate in linkup events. Linkups are user-generated events for various activities, and this app facilitates communication and organization among participants.

## Table of Contents

1. [Linkup Creation and Management](#linkup-creation-and-management)
2. [Linkup Display and Filtering](#linkup-display-and-filtering)
3. [Linkup Details and Messaging](#linkup-details-and-messaging)
4. [Notification System](#notification-system)
5. [Accepting and Initializing Linkups](#accepting-and-initializing-linkups)
6. [State Management](#state-management)
7. [Component Architecture](#component-architecture)
8. [Styling and UI](#styling-and-ui)
9. [Server and API Endpoints](#server-and-api-endpoints)
10. [User Account Deactivation and Reactivation](#user-account-deactivation-and-reactivation)

## Linkup Creation and Management

The Linkup app provides users with the ability to create, edit, and delete linkup events. The process involves the following steps:

- Users input activity, date/time, location, and gender preference in the CreateLinkupForm component (CreateLinkupForm.js).
- Data is sent to the server via an API call (linkupAPI.js) for storage.
- Created linkups are displayed on the Home Page with an 'active' status.
- Linkups can be edited through the EditCreateLinkupForm component (EditCreateLinkupForm.js).
- Deleted linkups are removed from the Home Page by using the delete API call (linkupAPI.js).

## Linkup Display and Filtering

The Home Page (HomePage.js) displays linkups based on the user's gender preference. Key features include:

- Fetching and displaying active linkups using an API call (linkupAPI.js).
- Applying gender-based filtering to show relevant linkups.
- Ensuring gender-neutral linkups are displayed to all users.

## Linkup Details and Messaging

Users can view and interact with linkup details via the SendRequestPage (SendRequestPage.js). This component allows:

- Viewing linkup information and sending a message to the linkup creator.
- API calls (messagingAPI.js) for sending and receiving messages.
- Linking conversations to specific linkups.

## Notification System

A notification system enhances user experience:

- Notifications are sent using the notificationAPI.js.
- Notifications are stored in Redux (notificationReducer.js) and displayed on the UI.
- Users can mark notifications as read.

## Accepting and Initializing Linkups

After messaging, users can accept or decline linkup requests:

- The MessagesPage component (MessagesPage.js) displays conversations.
- ChatComponent (Chat.js) allows users to chat.
- Users can accept or decline linkup requests.
- Accepted linkups trigger reminders for participants.

## State Management

Redux (redux/) is used for managing app state:

- Actions (actions/) and reducers (reducers/) manage registration data, user data, linkup info, messages, and notifications.
- Ensures a consistent and predictable state throughout the app.

## Component Architecture

The app follows a modular component structure (components/):

- Components are divided into smaller units for maintainability.

## Styling and UI

A cohesive UI enhances user experience:

- makeStyles from "@material-ui/core/styles" ensures consistent styling.
- User-friendly interfaces follow intuitive design principles.

## Server and API Endpoints

The backend (server/) services handle authentication, user management, linkup management, messaging, and notifications:

- API endpoints manage authentication, user actions, linkup actions, messaging, and notifications.
- Docker and Redis are utilized for enhanced app performance and scalability.

## User Account Deactivation and Reactivation

The implemented solution for user account deactivation and reactivation enhances user control while maintaining data integrity. Deactivation and reactivation functionalities are crucial for users who wish to temporarily pause or resume their engagement with the platform. The solution presented below uses soft deletes and status tracking to simplify the process and maintain data integrity.

**Deactivation:**

1. **User Request:** When a user requests to deactivate their account, their account status is changed to "inactive" in the database.

2. **Data Soft Deletion:** To ensure user data is retained, we employ a soft deletion mechanism. We set the "hidden" column of the user's linkups, linkup requests, and notifications to true. This hides the data from user interfaces while keeping the data accessible for potential reactivation.

**Reactivation:**

1. **User Request:** When a user requests to reactivate their account, we update their account status to "active" in the database.

2. **Data Restoration:** To restore user data, we simply set the "hidden" column back to false for the user's linkups, linkup requests, and notifications. This action makes the data visible again in the user interfaces.

**Benefits of the Solution:**

- **Simplicity:** The solution is straightforward and avoids the need for complex data restoration mechanisms.

- **User Control:** Users have the autonomy to temporarily deactivate and reactivate their accounts without losing their data.

- **Data Integrity:** Soft deletes ensure data integrity, as the data is not permanently removed from the system.

- **Minimal Impact:** The approach minimally affects existing data structures and workflows, making it easy to implement.

**Usage:**

- To deactivate an account, the user initiates the process through the platform's interface.

- To reactivate an account, users follow the reactivation process through the platform.


## Conclusion

This documentation provides a high-level overview of the Linkup app's features and functionalities. For detailed implementation and code examples, please refer to the app's source code.

---

---

## Database Tables Documentation

### Table: users
Stores user information including profile details, authentication, and preferences.

Columns:
- `id`: Unique identifier for each user.
- `phone_number`: User's phone number.
- `name`: User's name.
- `gender`: User's gender.
- `date_of_birth`: User's date of birth.
- `password`: User's password.
- `link_up_score`: User's linkup score.
- `created_at`: Timestamp of user creation.
- `updated_at`: Timestamp of last user update.
- `bio`: User's biography.
- `status`: User's status.
- `avatar`: User's avatar image URL.

### Table: link_ups
Stores details about created linkups, their creators, and associated information.

Columns:
- `id`: Unique identifier for each linkup.
- `creator_id`: ID of the user who created the linkup.
- `location`: Location of the linkup.
- `activity`: Activity of the linkup.
- `date`: Date and time of the linkup.
- `gender_preference`: Gender preference for the linkup.
- `created_at`: Timestamp of linkup creation.
- `updated_at`: Timestamp of last linkup update.
- `status`: Linkup status.
- `creator_name`: Name of the linkup creator.

### Table: link_up_requests
Manages requests related to linkups, including status and messages.

Columns:
- `id`: Unique identifier for each linkup request.
- `linkup_id`: ID of the related linkup.
- `receiver_id`: ID of the user receiving the request.
- `status`: Request status.
- `created_at`: Timestamp of request creation.
- `updated_at`: Timestamp of last request update.
- `message`: Request message.
- `requester_id`: ID of the user making the request.

### Table: images
Stores user images, including avatars.

Columns:
- `id`: Unique identifier for each image.
- `user_id`: ID of the user associated with the image.
- `image_url`: URL of the image.
- `is_avatar`: Indicates if the image is an avatar.
- `created_at`: Timestamp of image creation.
- `updated_at`: Timestamp of last image update.

### Table: conversations
Stores information about conversations, such as participants, unread counts, and status.

Columns:
- `conversation_id`: Unique identifier for each conversation.
- `participants`: Array of participant IDs.
- `created_at`: Timestamp of conversation creation.
- `updated_at`: Timestamp of last conversation update.
- `last_message`: Content of the last message.
- `unread_count`: Count of unread messages.
- `archived`: Indicates if the conversation is archived.
- `muted`: Indicates if the conversation is muted.
- `pinned`: Indicates if the conversation is pinned.
- `notifications_enabled`: Indicates if notifications are enabled for the conversation.

### Table: messages
Stores individual messages within conversations.

Columns:
- `message_id`: Unique identifier for each message.
- `conversation_id`: ID of the conversation the message belongs to.
- `sender_id`: ID of the message sender.
- `content`: Content of the message.
- `timestamp`: Timestamp of message creation.
- `is_read`: Indicates if the message is read.
- `is_system_message`: Indicates if the message is a system message.
- `attachments`: JSON array of message attachments.

### Table: notifications
Manages notifications for users.

Columns:
- `id`: Unique identifier for each notification.
- `user_id`: ID of the user associated with the notification.
- `type`: Type of the notification.
- `content`: Notification content.
- `is_read`: Indicates if the notification is read.
- `created_at`: Timestamp of notification creation.
- `updated_at`: Timestamp of last notification update.
- `requester_id`: ID of the request sender (if applicable).
- `link_up_id`: ID of the related linkup (if applicable).

### Table: participants
Manages participants in conversations, including their status and join time.

Columns:
- `participant_id`: Unique identifier for each participant.
- `user_id`: ID of the participant user.
- `conversation_id`: ID of the related conversation.
- `last_read_message_id`: ID of the last read message.
- `is_muted`: Indicates if the participant is muted.
- `is_blocked`: Indicates if the participant is blocked.
- `joined_at`: Timestamp of participant join time.

### Table: ratings
Stores ratings provided by users for linkups.

Columns:
- `id`: Unique identifier for each rating.
- `link_up_id`: ID of the rated linkup.
- `user_id`: ID of the user providing the rating.
- `rating`: Rating value.
- `reason`: Rating reason.
- `created_at`: Timestamp of rating creation.
- `updated_at`: Timestamp of last rating update.

---
