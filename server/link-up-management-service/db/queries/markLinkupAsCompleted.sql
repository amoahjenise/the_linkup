UPDATE link_ups
SET status = 'completed'
WHERE id = $1::uuid
AND status = 'active'
RETURNING id, creator_id, location, activity, date, gender_preference, created_at, updated_at, status;
