SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = $1::uuid
  AND is_read = false
  AND hidden = false;

