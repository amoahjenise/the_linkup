SELECT DISTINCT ON (M.message_id)
  M.message_id, 
  M.*,
  U.name AS sender_name,
  U.avatar AS sender_avatar,
  R.name AS receiver_name,
  R.avatar AS receiver_avatar,
  P.user_id AS participant_id,
  C.linkup_id,
  CASE
    WHEN M.sender_id = $2::uuid THEN R.name
    ELSE S.name
  END AS receiver_name,
  CASE
    WHEN M.sender_id = $2::uuid THEN R.avatar
    ELSE S.avatar
  END AS receiver_avatar
FROM messages AS M
JOIN users AS U ON M.sender_id = U.id
JOIN participants AS P ON M.conversation_id = P.conversation_id
JOIN conversations AS C ON M.conversation_id = C.conversation_id
JOIN users AS S ON P.user_id = S.id -- Sender
JOIN users AS R ON (CASE WHEN M.sender_id = $2::uuid THEN M.receiver_id ELSE M.sender_id END) = R.id -- Receiver
WHERE M.conversation_id = $1::uuid
  AND (M.sender_id = $2::uuid OR M.receiver_id = $2::uuid)
ORDER BY M.message_id, M.timestamp;
