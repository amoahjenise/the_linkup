SELECT DISTINCT
    c.conversation_id,
    (
        SELECT COUNT(*) FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        AND m.is_read = false
        AND m.receiver_id = $1::uuid
    ) AS unread_count,
    p1.user_id AS participant_id_1,
    p2.user_id AS participant_id_2,
    u1.name AS participant_name_1,
    u2.name AS participant_name_2,
    u1.avatar AS participant_avatar_1,
    u2.avatar AS participant_avatar_2,
    (
        SELECT m.content
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.timestamp DESC
        LIMIT 1
    ) AS last_message,
    (
        SELECT m.timestamp
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.timestamp DESC
        LIMIT 1
    ) AS last_message_timestamp,
    (
        SELECT m.sender_id
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.timestamp DESC
        LIMIT 1
    ) AS last_message_sender_id,
    (
        SELECT u.name
        FROM users AS u
        WHERE u.id = (
            SELECT m.sender_id
            FROM messages AS m
            WHERE m.conversation_id = c.conversation_id
            ORDER BY m.timestamp DESC
            LIMIT 1
        )
    ) AS last_message_sender_name,
    (
        SELECT u.avatar
        FROM users AS u
        WHERE u.id = (
            SELECT lur.requester_id
            FROM link_up_requests AS lur
            WHERE lur.linkup_id = c.linkup_id
        )
    ) AS linkup_requester_avatar,
    (
        SELECT u.name
        FROM users AS u
        WHERE u.id = (
            SELECT lur.requester_id
            FROM link_up_requests AS lur
            WHERE lur.linkup_id = c.linkup_id
        )
    ) AS linkup_requester_name,
    (
        SELECT u.id
        FROM users AS u
        WHERE u.id = (
            SELECT lur.requester_id
            FROM link_up_requests AS lur
            WHERE lur.linkup_id = c.linkup_id
        )
    ) AS linkup_requester_id,
    (
        SELECT u.id
        FROM users AS u
        WHERE u.id = (
            SELECT l.creator_id
            FROM link_ups AS l
            WHERE l.id = c.linkup_id
        )
    ) AS linkup_creator_id,
    (
        SELECT u.avatar
        FROM users AS u
        WHERE u.id = (
           SELECT l.creator_id
            FROM link_ups AS l
            WHERE l.id = c.linkup_id
        )
    ) AS linkup_creator_avatar,
    (
        SELECT u.name
        FROM users AS u
        WHERE u.id = (
          SELECT l.creator_id
            FROM link_ups AS l
            WHERE l.id = c.linkup_id
        )
    ) AS linkup_creator_name,
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
