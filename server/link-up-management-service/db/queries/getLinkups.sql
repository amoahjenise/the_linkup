SELECT link_ups.*, users.avatar
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
WHERE
  (link_ups.gender_preference = users.gender OR link_ups.gender_preference = 'any')
  OR link_ups.creator_id = $1::uuid
ORDER BY link_ups.created_at DESC;
