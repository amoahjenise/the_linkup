WITH active_linkups AS (
  SELECT COUNT(*) AS count
  FROM link_ups
  WHERE
    (link_ups.creator_id = $1::uuid OR
    (link_ups.creator_id != $1::uuid AND
    (link_ups.gender_preference = $2 OR link_ups.gender_preference = 'any')))
    AND link_ups.hidden <> true
    AND link_ups.status = 'active'
)
SELECT link_ups.*, users.avatar, active_linkups.count AS total_active_linkups
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
CROSS JOIN active_linkups
WHERE
  (link_ups.creator_id = $1::uuid OR
  (link_ups.creator_id != $1::uuid AND
  (link_ups.gender_preference = $2 OR link_ups.gender_preference = 'any')))
  AND link_ups.hidden <> true
  AND link_ups.status = 'active'
ORDER BY link_ups.created_at DESC
LIMIT $4::int  -- Limit the number of results per page
OFFSET $3::int; -- Offset to skip the results of previous pages
