SELECT
    n.id,
    n.user_id,
    n.requester_id,    
    n.notification_type,
    n.link_up_id,
    n.content,
    n.is_read,
    n.created_at,
    n.updated_at,
    u.name AS requester_name,
    u.avatar AS requester_avatar,
    u_receiver.name AS receiver_name,
    u_receiver.avatar AS receiver_avatar,
    u.is_online AS requester_is_online,
    u_receiver.is_online AS receiver_is_online,
    lur.message AS message
FROM notifications n
JOIN users u ON n.requester_id = u.id
JOIN link_up_requests lur ON n.link_up_id = lur.linkup_id AND n.requester_id = lur.requester_id
JOIN users u_receiver ON lur.receiver_id = u_receiver.id
WHERE n.user_id = $1::uuid
  AND n.hidden <> true
ORDER BY n.created_at DESC;
