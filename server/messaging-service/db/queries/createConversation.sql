-- createConversation.sql

WITH new_conversation AS (
  INSERT INTO conversations (last_message, linkup_id, unread_count)
  VALUES ($1, $2::uuid, 1::int)
  RETURNING conversation_id
)
SELECT conversation_id FROM new_conversation;
