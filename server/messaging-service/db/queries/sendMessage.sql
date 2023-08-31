INSERT INTO messages (conversation_id, sender_id, content)
VALUES (
 $1, $2, $3
)
RETURNING conversation_id;