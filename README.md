Certainly! Here's the updated documentation with the changes you requested:

---

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

## Table of Contents

1. [Authentication](#authentication)
2. [Linkup Creation and Management](#linkup-creation-and-management)
3. [Linkup Display and Filtering](#linkup-display-and-filtering)
4. [Linkup Details and Messaging](#linkup-details-and-messaging)
5. [Notification System](#notification-system)
6. [Accepting and Initializing Linkups](#accepting-and-initializing-linkups)
7. [State Management](#state-management)
8. [Component Architecture](#component-architecture)
9. [Styling and UI](#styling-and-ui)
10. [Server and API Endpoints](#server-and-api-endpoints)
11. [User Account Deactivation and Reactivation](#user-account-deactivation-and-reactivation)
12. [Search Functionality](#search-functionality)
13. [Database Tables Documentation](#database-tables-documentation)

## Authentication

### Introduction
The recent update to the LUUL React App repository introduces the integration of Clerk for authentication. Clerk provides robust authentication services, enhancing the security and user experience of the application. Additionally, webhooks have been implemented to synchronize user creation and deletion events with the PostgreSQL database.

### Integration with Clerk for Authentication
The integration with Clerk for authentication enhances the user authentication process by providing secure and seamless authentication services. The integration involves:

1. **Installation and Configuration**: Clerk components for sign-in and sign-up have been added to the application. These components are configured to work with Clerk's authentication service, enabling users to authenticate securely.

2. **Routing**: Appropriate routing has been implemented to ensure users can access the sign-in and sign-up components seamlessly.

3. **User Authentication**: Logic has been implemented to authenticate users using Clerk's authentication service. Upon successful authentication, users are redirected to the desired page within the application.

### Webhooks for User Management
Webhooks have been implemented to synchronize user creation and deletion events with the PostgreSQL database. This ensures that user data remains consistent across the application. The webhook implementation involves:

1. **Webhook Endpoint Setup**: Webhook endpoints have been set up in the backend server to receive user creation and deletion events from Clerk.The implementation for webhook endpoints for user creation can be found in luul/server/auth-service/index.js, while the implementation for managing user deletion can be found in luul/server/user-management-service/index.js.

2. **Verification and Event Handling**: Upon receiving webhook payloads, the application verifies the authenticity of the payloads and handles user creation and deletion events accordingly. User data is stored or removed from the PostgreSQL database based on the received events.

### Client-Side Integration
The client-side of the application has been updated to handle user authentication status and redirect users accordingly. Additionally, logic has been implemented to fetch and display user-specific data based on authentication status.

### Conclusion
The integration of Clerk for authentication and the implementation of webhooks for user management enhance the security and functionality of the LUUL React App. Users can now authenticate securely and seamlessly, while user data remains synchronized with the PostgreSQL database in real-time.

For detailed implementation and code examples, please refer to the updated documentation and codebase available in the LUUL React App repository.


## Linkup Creation and Management

The Linkup app provides users with the ability to create, edit, and delete linkup events. The process involves the following steps:

- Users input activity, date/time, location, gender preference, and payment option in the CreateLinkupForm component (CreateLinkupForm.js).
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

2. **Data Soft Deletion:** To ensure user data is retained, we employ a soft deletion mechanism. We set the "hidden" column of the user's linkups, linkup requests, and notifications to true. This hides the data from user

 interfaces while keeping the data accessible for potential reactivation.

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


## Search Functionality

The search functionality in the LUUL React App allows users to search for linkup events based on specific criteria such as activity type, creator name, date/time, and payment option. This feature enhances user experience by enabling quick and efficient discovery of relevant linkup events.

Implementation Details
Client-Side Integration:

The search functionality is implemented on the client-side using React components.
A SearchInput component allows users to input search queries.
When users enter a search query, an API request is triggered to fetch linkup events matching the search criteria.
Server-Side Handling:

On the server-side, an API endpoint '${BASE_URL}/api/linkups/search/${userId}' is responsible for processing search requests.
The server receives the search query and filters linkup events based on the specified criteria.
The filtered linkup events are then returned to the client for display.

**Search Criteria:**

The search functionality supports searching for linkup events based on activity type, creator name, date/time, and payment option.
Users can enter partial or complete search queries to find relevant linkup events.

**Debounce Functionality:**

To optimize performance and prevent excessive API requests, a debounce function is implemented on the client-side.
The debounce function delays the execution of the search API request until a specified time has passed since the user's last input.

**Entering Search Queries:**

Users can enter search queries in the SearchInput component, specifying criteria such as activity type, creator name, date/time, and payment option.
Partial or complete search queries are supported, allowing for flexible search options.

**Viewing Search Results:**

After entering a search query, users can view the search results displayed on the screen.
The search results consist of linkup events that match the specified search criteria.

**Refining Search Queries:**

Users can refine their search queries by adjusting the input parameters in the SearchInput component.
Refining search queries allows users to find more specific or relevant linkup events.

Conclusion
The search functionality in the LUUL React App enhances user experience by enabling quick and efficient discovery of relevant linkup events. By allowing users to search based on various criteria, the app provides a flexible and intuitive way to find linkup events that match their preferences.


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
- `clerk_user_id`: ID of the Clerk user.

### Table: link_ups
Stores details about created linkups, their creators, and associated information.

Columns:
- `id`: Unique identifier for each linkup.
- `creator_id`: ID of the user who created the linkup.
- `location`: Location of the linkup.
- `activity`: Activity of the linkup.
- `date`: Date and time of the linkup.
- `gender_preference`: Gender preference for the linkup.
- `payment_option`: Payment option for the linkup ("split", "iWillPay", "pleasePay", "").
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
