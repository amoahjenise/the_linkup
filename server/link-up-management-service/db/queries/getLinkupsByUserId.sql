SELECT link_ups.*, users.avatar
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
WHERE link_ups.creator_id = $1
  AND link_ups.hidden <> true
  AND link_ups.status <> 'inactive'
ORDER BY link_ups.created_at DESC;
