SELECT link_ups.*, users.avatar
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
ORDER BY link_ups.created_at DESC;
