SELECT link_ups.*, users.avatar
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
WHERE
  (link_ups.creator_id = $1::uuid OR
  (link_ups.creator_id != $1::uuid AND
  (link_ups.gender_preference = $2 OR link_ups.gender_preference = 'any')))
ORDER BY link_ups.created_at DESC;
