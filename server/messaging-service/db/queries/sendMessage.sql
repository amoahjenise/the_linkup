INSERT INTO messages (sender_id, receiver_id, content, conversation_id)
VALUES (
 $1::uuid, $2::uuid, $3, $4::uuid
)
RETURNING 
  message_id, 
  sender_id, 
  receiver_id, 
  content, 
  conversation_id, 
  timestamp;
