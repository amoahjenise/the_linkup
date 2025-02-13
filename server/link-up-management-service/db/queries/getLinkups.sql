WITH active_linkups AS (
  SELECT COUNT(*) AS count
  FROM link_ups
  WHERE
    (link_ups.creator_id = $1::uuid OR
    (link_ups.creator_id != $1::uuid AND
    link_ups.gender_preference && $2::text[]))  -- Array overlap for gender preference
    AND link_ups.hidden <> true
    AND link_ups.status = 'active'
),
linkups_with_distance AS (
  SELECT
    link_ups.*,
    users.name,
    users.avatar,
    users.gender AS creator_gender,
    users.is_online,
    users.latitude,
    users.longitude,
    users.date_of_birth,
    active_linkups.count AS total_active_linkups,
    COALESCE((
      6371 * acos(
        least(1, greatest(-1, 
          cos(radians($5)) * cos(radians(users.latitude)) * 
          cos(radians(users.longitude) - radians($6)) +
          sin(radians($5)) * sin(radians(users.latitude))
        ))
      )
    ), 0) AS distance,  -- Ensure distance starts from 0
    DATE_PART('year', AGE(users.date_of_birth)) AS creator_age  -- Calculate age
  FROM link_ups
  INNER JOIN users ON link_ups.creator_id = users.id
  CROSS JOIN active_linkups
  WHERE
    (link_ups.creator_id = $1::uuid OR
    (link_ups.creator_id != $1::uuid AND
    link_ups.gender_preference && $2::text[]))  -- Array overlap for gender preference
    AND link_ups.hidden <> true
    AND link_ups.status = 'active'
)
SELECT *
FROM linkups_with_distance
ORDER BY created_at DESC, distance ASC
LIMIT $4::int  -- Limit the number of results per page
OFFSET $3::int; -- Offset to skip the results of previous pages;
