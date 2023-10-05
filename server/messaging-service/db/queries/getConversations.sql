SELECT DISTINCT
    c.conversation_id,
    p1.user_id AS participant_id_1,
    p2.user_id AS participant_id_2,
    u1.name AS participant_name_1,
    u2.name AS participant_name_2,
    u1.avatar AS participant_avatar_1,
    u2.avatar AS participant_avatar_2,    
    c.last_message,
    c.created_at
FROM
    conversations AS c
JOIN
    participants AS p1 ON c.conversation_id = p1.conversation_id
JOIN
    participants AS p2 ON c.conversation_id = p2.conversation_id
JOIN
    users AS u1 ON p1.user_id = u1.id
JOIN
    users AS u2 ON p2.user_id = u2.id    
WHERE
    (p1.user_id = $1::uuid OR p2.user_id = $1::uuid)
    AND p1.user_id != p2.user_id -- Ensure both participants are different
ORDER BY
    c.created_at DESC;
