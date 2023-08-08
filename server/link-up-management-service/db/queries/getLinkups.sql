SELECT link_ups.*, users.avatar
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id;

-- WHERE status = 'pending'
-- ORDER BY created_at DESC;
