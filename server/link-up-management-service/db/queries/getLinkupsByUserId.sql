SELECT 
    link_ups.*, 
    users.avatar,
    users.name,
    users.avatar,
    users.gender AS creator_gender,
    users.is_online,
    users.latitude,
    users.longitude,
    users.date_of_birth
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
WHERE link_ups.creator_id = $1
  AND link_ups.hidden <> true
  AND link_ups.status <> 'inactive'
ORDER BY link_ups.created_at DESC;
