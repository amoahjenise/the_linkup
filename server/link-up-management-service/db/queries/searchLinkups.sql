WITH active_linkups AS (
  SELECT COUNT(*) AS count
  FROM link_ups
  WHERE
    (link_ups.creator_id = $3::uuid OR
    (link_ups.creator_id != $3::uuid AND
    $2 = ANY(link_ups.gender_preference)))  -- Remove 'any'
    AND link_ups.hidden <> true
    AND link_ups.status = 'active'
)
SELECT link_ups.*, users.avatar, active_linkups.count AS total_active_linkups
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
CROSS JOIN active_linkups
WHERE
  (
    (activity ILIKE $1 OR creator_name ILIKE $1 OR date::TEXT ILIKE $1 OR payment_option ILIKE $1 OR location ILIKE $1)
    AND link_ups.status = 'active'
    AND $2 = ANY(link_ups.gender_preference)  -- Remove 'any'
  )
  OR
  (
    (activity ILIKE $1 OR creator_name ILIKE $1 OR date::TEXT ILIKE $1 OR payment_option ILIKE $1 OR location ILIKE $1)
    AND link_ups.status = 'active'
    AND creator_id = $3::uuid
  )
ORDER BY link_ups.created_at DESC;
-- LIMIT $4::int  -- Limit the number of results per page
-- OFFSET $5::int; -- Offset to skip the results of previous pages
