Certainly! Here's the updated documentation with the changes you requested:

---

# The Linkup

The Linkup React App Repository

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
  - Sendbird SDK Integration
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
4. [Linkup Details and Messaging Integration with Sendbird](#linkup-details-and-messaging-integration-with-sendbird)
5. [Notification System](#notification-system)
6. [Accepting and Initializing Linkups](#accepting-and-initializing-linkups)
7. [State Management](#state-management)
8. [Component Architecture](#component-architecture)
9. [Styling and UI](#styling-and-ui)
10. [Server and API Endpoints](#server-and-api-endpoints)
11. [User Account Deactivation and Reactivation](#user-account-deactivation-and-reactivation)
12. [Search Functionality](#search-functionality)
13. [Database Tables Documentation](#database-tables-documentation)
14. [Testing Scenarios](#testing-scenarios)
    - [User Registration](#user-registration)
    - [Enabling Location Sharing](#enabling-location-sharing)
    - [Creating a Linkup](#creating-a-linkup)
    - [Editing a Linkup](#editing-a-linkup)
    - [Refreshing the Feed](#refreshing-the-feed)
    - [Searching for a Linkup](#searching-for-a-linkup)
    - [Deleting a Linkup](#deleting-a-linkup)
    - [Closing a Linkup](#closing-a-linkup)
    - [Accessing Linkup History](#accessing-linkup-history)
    - [Profile Page Actions](#profile-page-actions)
    - [Interacting with Linkups](#interacting-with-linkups)
    - [Handling Requests](#handling-requests)
    - [Account Management](#account-management)
    - [Linkup History Filters](#linkup-history-filters)
    - [Notifications](#notifications)
    - [Signing Out and Signing In](#signing-out-and-signing-in)
    - [Linkup Location Visibility](#linkup-location-visibility)
    -

## Authentication

### Introduction

The recent update to the The Linkup React App repository introduces the integration of Clerk for authentication. Clerk provides robust authentication services, enhancing the security and user experience of the application. Additionally, webhooks have been implemented to synchronize user creation and deletion events with the PostgreSQL database.

### Integration with Clerk for Authentication

The integration with Clerk for authentication enhances the user authentication process by providing secure and seamless authentication services. The integration involves:

1. **Installation and Configuration**: Clerk components for sign-in and sign-up have been added to the application. These components are configured to work with Clerk's authentication service, enabling users to authenticate securely.

2. **Routing**: Appropriate routing has been implemented to ensure users can access the sign-in and sign-up components seamlessly.

3. **User Authentication**: Logic has been implemented to authenticate users using Clerk's authentication service. Upon successful authentication, users are redirected to the desired page within the application.

### Webhooks for User Management

Webhooks have been implemented to synchronize user creation and deletion events with the PostgreSQL database. This ensures that user data remains consistent across the application. The webhook implementation involves:

1. **Webhook Endpoint Setup**: Webhook endpoints have been set up in the backend server to receive user creation and deletion events from Clerk.The implementation for webhook endpoints for user creation can be found in The Linkup/server/auth-service/index.js, while the implementation for managing user deletion can be found in The Linkup/server/user-management-service/index.js.

2. **Verification and Event Handling**: Upon receiving webhook payloads, the application verifies the authenticity of the payloads and handles user creation and deletion events accordingly. User data is stored or removed from the PostgreSQL database based on the received events.

### Client-Side Integration

The client-side of the application has been updated to handle user authentication status and redirect users accordingly. Additionally, logic has been implemented to fetch and display user-specific data based on authentication status.

### Conclusion

The integration of Clerk for authentication and the implementation of webhooks for user management enhance the security and functionality of the The Linkup React App. Users can now authenticate securely and seamlessly, while user data remains synchronized with the PostgreSQL database in real-time.

For detailed implementation and code examples, please refer to the updated documentation and codebase available in the The Linkup React App repository.

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

## Linkup Details and Messaging Integration with Sendbird

**Overview**

We integrated our application with Sendbird, a powerful messaging platform, to enable real-time communication between users. This integration enhances the user experience by providing a seamless and feature-rich chat environment. Users can send a request to a specific linkup via the SendRequestPage (SendRequestPage.js). This component allows:
Viewing public linkup information and initiating a conversation with the linkup creator.

**Sendbird Integration Details**

- The Sendbird UIKit React library was utilized to integrate Sendbird's messaging features into our application.
- The library provided components such as SBConversation, SBChannelList, and SBChannelSettings, which we used to manage conversations, display channel lists, and configure channel settings, respectively.

**Channel Management**

- Channels are managed using the GroupChannel functionality provided by Sendbird. Each channel represents a conversation between users.
- The GroupChannelList component is used to display a list of channels, allowing users to select and navigate to specific conversations.

**Channel Data Handling**

- The Sendbird channels were associated with conversations in our application. The Sendbird channel URL (\_url) is stored in the conversations table.
- The conversations table schema includes fields for conversation_id (Sendbird channel URL), created_at, updated_at, operator_id, request_id, and linkup_id.

**Linkup Integration**

- We integrated linkup functionalities into the conversation flow.
- Linkup data is retrieved based on the conversation's Sendbird channel URL.
- Once a linkup is associated with a conversation, its details are displayed in the conversation header.

**User Role Detection**

- User roles, specifically the operator role, are detected within the Sendbird channel members. The isOperator state is set based on whether the current user has the operator role in the conversation.

**Message Input Handling**

- Message input was disabled under specific conditions, such as when the linkup request was declined or when the conversation involved only one message and the linkup request was not yet accepted.
  The isMessageInputDisabled state controlled the message input component's disabled state based on these conditions.

**Error Handling**

- We implemented error handling for network requests and data retrieval processes, logging any encountered errors to the console for debugging purposes.

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

- styled from "@material-ui/core/styles" ensures consistent styling.
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

The search functionality in the The Linkup React App allows users to search for linkup events based on specific criteria such as activity type, creator name, date/time, and payment option. This feature enhances user experience by enabling quick and efficient discovery of relevant linkup events.

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
The search functionality in the The Linkup React App enhances user experience by enabling quick and efficient discovery of relevant linkup events. By allowing users to search based on various criteria, the app provides a flexible and intuitive way to find linkup events that match their preferences.

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
- `created_at`: Timestamp of conversation creation.
- `updated_at`: Timestamp of last conversation update.
- `operator_id`: Unique identifier for the Sendbird Group Channel operator.
- `request_id`: Unique identifier for the requester.
- `linkup_id`: Unique identifier for the linkup associated to the conversation.

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

## Testing Scenarios

### User Registration

- **Scenario:** User accesses the website and initiates the registration process.
  - **Steps:**
    1. Access the website `http://localhost:3000/`.
    2. Click on the "Sign Up" button.
    3. Fill in the required information: First and Last names, phone number, and a secure password.
    4. Continue through the registration process, including phone number verification, gender/date of birth input, and profile picture selection.
    5. Complete the registration process and navigate to the Home page.

### Enabling Location Sharing

- **Scenario:** User enables location sharing when prompted.
  - **Steps:**
    1. After registration, when prompted to enable location sharing, click on "Allow".
    2. Verify that the user can see the feed with location-based content.

### Creating a Linkup

- **Scenario:** User creates a new linkup event.
  - **Steps:**
    1. Navigate to the Home page.
    2. Use the widget on the right side of the feed to create a linkup.
    3. Input details such as activity, location, date/time, gender preference, and payment option.
    4. Click on "Create" and verify that the linkup appears in the feed.

### Editing a Linkup

- **Scenario:** User edits an existing linkup event.
  - **Steps:**
    1. Navigate to the Home page.
    2. Click on the horizontal menu on the linkup item and select "Edit this linkup".
    3. Modify each field and click on "Update".
    4. Verify that the changes are reflected in the linkup details.

### Refreshing the Feed

- **Scenario:** User refreshes the feed.
  - **Steps:**
    1. Navigate to the Home page.
    2. Trigger a manual refresh of the feed.
    3. Verify that the feed updates with the latest content.

### Searching for a Linkup

- **Scenario:** User searches for a specific linkup event.
  - **Steps:**
    1. Use the search functionality to enter search criteria such as activity type, creator name, date/time, or payment option.
    2. Verify that relevant linkup events are displayed based on the search criteria.

### Deleting a Linkup

- **Scenario:** User deletes an existing linkup event.
  - **Steps:**
    1. Navigate to the Home page.
    2. Click on the horizontal menu on the linkup item and select "Delete this linkup".
    3. Confirm the deletion and verify that the linkup is removed from the feed.

### Closing a Linkup

- **Scenario:** User closes an ongoing linkup event.
  - **Steps:**
    1. Navigate to the Home page.
    2. Click on the horizontal menu on the linkup item and select "Close this linkup".
    3. Confirm the closure and verify that the linkup status is updated accordingly.

### Accessing Linkup History

- **Scenario:** User accesses the linkup history page/tab.
  - **Steps:**
    1. Navigate to the Home page.
    2. Click on the "Go to linkup" option from a specific linkup item.
    3. Verify that the user is directed to the linkup history page/tab.

### Profile Page Actions

- **Scenario:** User performs actions on the profile page, such as updating avatar, adding/removing bio, and uploading images.
  - **Steps:**
    1. Access the profile page.
    2. Perform various actions such as changing avatar, adding bio, uploading images, etc.
    3. Verify that the changes are reflected in the profile page.

### Interacting with Link-Ups

- **Scenario:** User interacts with other users' linkup events, including sending requests, chatting, accepting/declining requests, etc.
  - **Steps:**
    1. Access a specific linkup event.
    2. Perform actions such as sending requests, initiating chats, accepting/declining requests, etc.
    3. Verify that the interactions are processed correctly and reflected in the UI.

### Handling Requests

1. Receive incoming requests for linkup participation.
2. Accept or decline the requests based on user preferences.
3. Verify that the status of the requests is updated accordingly and notifications are sent to the relevant users.
4. Ensure that the linkup details are updated with the accepted participants.

### Account Management

- **Scenario:** User manages account settings, including deactivating/reactivating the account and enabling/disabling location sharing.
  - **Steps:**
    1. Access the account settings page.
    2. Perform actions such as deactivating/reactivating the account and enabling/disabling location sharing.
    3. Verify that the changes are applied correctly and reflected in the account settings.

### Linkup History Filters

- **Scenario:** User applies filters to the linkup history page/tab.
  - **Steps:**
    1. Access the linkup history page/tab.
    2. Apply various filters such as activity type, date/time, location, etc.
    3. Verify that the linkup events are filtered based on the selected criteria.

### Notifications

- **Scenario:** User receives notifications for new requests and other relevant events.
  - **Steps:**
    1. Trigger events that generate notifications, such as receiving new requests or messages.
    2. Verify that notifications are displayed in real-time and reflect the relevant events.
    3. Mark notifications as read and verify that they are updated accordingly.

### Signing Out and Signing In

- **Scenario:** User signs out of the app and signs back in.
  - **Steps:**
    1. Sign out of the app.
    2. Sign back in using valid credentials.
    3. Verify that the sign-in process is smooth and the user's data is loaded correctly.

### Linkup Location Visibility

- **Scenario:** User verifies that linkup location details are visible only for users with accepted requests.
  - **Steps:**
    1. Access a linkup event as a user with an accepted request.
    2. Verify that the location details are visible.
    3. Access the same linkup event as a user without an accepted request.
    4. Verify that the location details are not visible.
