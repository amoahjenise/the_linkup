SELECT DISTINCT ON (M.message_id)
  M.message_id, 
  M.*,
  U.name AS sender_name,
  U.avatar AS sender_avatar,
  P.user_id AS participant_id,
  C.linkup_id
FROM messages AS M
JOIN users AS U ON M.sender_id = U.id
JOIN participants AS P ON M.conversation_id = P.conversation_id
JOIN conversations AS C ON M.conversation_id = C.conversation_id
WHERE M.conversation_id = $1::uuid
  AND (M.sender_id = $2::uuid OR M.receiver_id = $2::uuid)
ORDER BY M.message_id, M.timestamp;
