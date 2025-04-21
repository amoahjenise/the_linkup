SELECT
  link_up_requests.*,
  link_ups.creator_id,
  link_ups.creator_name,
  link_ups.location,
  link_ups.activity,
  link_ups.payment_option,
  link_ups.date AS link_up_date,
  users.avatar,
  (SELECT name FROM users WHERE id = link_up_requests.requester_id) AS requester_name,
  (SELECT avatar FROM users WHERE id = link_up_requests.requester_id) AS receiver_avatar
FROM
  link_up_requests
  INNER JOIN link_ups ON link_up_requests.linkup_id = link_ups.id
  INNER JOIN users ON link_up_requests.receiver_id = users.id
WHERE
  link_up_requests.receiver_id = $1::uuid
  AND link_up_requests.hidden <> true
  AND link_up_requests.status <> 'inactive'
  ORDER BY
  link_up_requests.created_at DESC; 