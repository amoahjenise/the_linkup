WITH active_linkups AS (
  SELECT COUNT(*) AS count
  FROM link_ups
  WHERE
    (link_ups.creator_id = $3::uuid OR
    (link_ups.creator_id != $3::uuid AND
    link_ups.gender_preference && $2::text[]))  
    AND link_ups.hidden <> true
    AND link_ups.status = 'active'
)
SELECT link_ups.*, users.avatar, users.gender AS creator_gender, users.is_online, users.latitude, users.longitude,
    users.date_of_birth, active_linkups.count AS total_active_linkups
FROM link_ups
INNER JOIN users ON link_ups.creator_id = users.id
CROSS JOIN active_linkups
WHERE
  (
    (SIMILARITY(activity, $1) > 0.2 OR SIMILARITY(creator_name, $1) > 0.2 OR date::TEXT ILIKE $1 OR SIMILARITY(payment_option, $1) > 0.2 OR SIMILARITY(location, $1) > 0.2)
    AND link_ups.status = 'active'
    AND link_ups.gender_preference && $2::text[]
  )
  OR
  (
    (SIMILARITY(activity, $1) > 0.2 OR SIMILARITY(creator_name, $1) > 0.2 OR date::TEXT ILIKE $1 OR SIMILARITY(payment_option, $1) > 0.2 OR SIMILARITY(location, $1) > 0.2)
    AND link_ups.status = 'active'
    AND creator_id = $3::uuid
  )
ORDER BY SIMILARITY(activity, $1) DESC, link_ups.created_at DESC;
