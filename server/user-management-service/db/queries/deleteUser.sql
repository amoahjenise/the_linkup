WITH updated_users AS (
  UPDATE users
  SET status = 'inactive', updated_at = NOW()
  WHERE clerk_user_id = $1
  RETURNING id
), 
updated_link_ups AS (
  UPDATE link_ups
  SET hidden = true, updated_at = NOW()
  WHERE creator_id IN (SELECT id FROM users WHERE clerk_user_id = $1)
  RETURNING id
),
updated_link_up_requests AS (
  UPDATE link_up_requests
  SET hidden = true, updated_at = NOW()
  WHERE requester_id IN (SELECT id FROM users WHERE clerk_user_id = $1)
     OR receiver_id IN (SELECT id FROM users WHERE clerk_user_id = $1)
  RETURNING id
),
updated_notifications AS (
  UPDATE notifications
  SET hidden = true, updated_at = NOW()
  WHERE requester_id IN (SELECT id FROM users WHERE clerk_user_id = $1)
  RETURNING id
)
SELECT id FROM updated_users;
