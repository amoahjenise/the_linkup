-- createConversation.sql

WITH new_conversation AS (
  INSERT INTO conversations (conversation_id, linkup_id, operator_id, requester_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
)
SELECT * FROM new_conversation;
