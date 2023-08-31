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
    MAX(lur.message) AS message
FROM notifications n
JOIN users u ON n.requester_id = u.id
JOIN link_up_requests lur ON n.link_up_id = lur.linkup_id
WHERE n.user_id = $1::uuid
  AND n.hidden <> true
GROUP BY n.id, n.user_id, n.requester_id, n.notification_type,
         n.link_up_id, n.content, n.is_read, n.created_at,
         n.updated_at, u.name, u.avatar
ORDER BY n.created_at DESC;
