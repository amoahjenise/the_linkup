UPDATE link_ups
SET status = 'closed'
WHERE id = $1::uuid
  AND status = 'active'
  AND date > NOW() -- Check if the scheduled date is in the future
RETURNING *;
