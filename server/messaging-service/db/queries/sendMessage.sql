WITH inserted_message AS (
  INSERT INTO messages (sender_id, receiver_id, content, conversation_id)
  VALUES ($1::uuid, $2::uuid, $3, $4::uuid)
  RETURNING message_id, sender_id, receiver_id, content, conversation_id, timestamp
)
SELECT 
  im.*,
  c.linkup_id
FROM inserted_message im
JOIN conversations c ON im.conversation_id = c.conversation_id;
