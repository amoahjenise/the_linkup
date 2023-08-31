WITH new_conversation AS (
  INSERT INTO conversations (participants, last_message)
  VALUES (ARRAY[$1::uuid, $2::uuid], $3) -- $1 = sender $2 = receiver
  RETURNING conversation_id
)
INSERT INTO messages (conversation_id, sender_id, content)
VALUES ((SELECT conversation_id FROM new_conversation), $1::uuid, $3);
