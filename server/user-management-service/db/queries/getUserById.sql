-- Replace $1 with the actual user ID

SELECT
  u.*,
  COUNT(l.id) AS total_linkups,
  COUNT(CASE WHEN l.status = 'completed' THEN 1 END) AS completed_linkups
FROM
  users u
LEFT JOIN
  link_ups l ON u.id = l.creator_id AND l.status <> 'inactive'
WHERE
  u.id = $1
AND
  u.status = 'active'
GROUP BY
  u.id;
