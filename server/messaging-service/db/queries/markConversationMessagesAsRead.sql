WITH updated_messages AS (
  UPDATE messages
  SET is_read = true
  WHERE conversation_id = $1
    AND receiver_id = $2
  RETURNING conversation_id
)
UPDATE conversations
SET unread_count = 0
WHERE conversation_id IN (SELECT DISTINCT conversation_id FROM updated_messages);
