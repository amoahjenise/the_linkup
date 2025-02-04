WITH updated_users AS (
  UPDATE users
  SET status = 'active', updated_at = NOW()
  WHERE id = $1::uuid
  RETURNING id
),
updated_link_ups AS (
  UPDATE link_ups
  SET hidden = false, updated_at = NOW()
  WHERE creator_id = $1::uuid
  RETURNING id
),
updated_link_up_requests AS (
  UPDATE link_up_requests
  SET hidden = false, updated_at = NOW()
  WHERE requester_id = $1::uuid OR receiver_id = $1::uuid
  RETURNING id
),
updated_notifications AS (
  UPDATE notifications
  SET hidden = false, updated_at = NOW()
  WHERE requester_id = $1::uuid 
  RETURNING id
)
SELECT * FROM updated_users
UNION ALL
SELECT * FROM updated_link_ups
UNION ALL
SELECT * FROM updated_link_up_requests
UNION ALL
SELECT * FROM updated_notifications;
