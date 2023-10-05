-- insertMessage.sql

INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
VALUES ($1, $2::uuid, $3::uuid, $4);
