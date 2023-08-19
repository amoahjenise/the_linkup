UPDATE link_ups
SET status = 'expired'
WHERE date <= NOW()
AND status = 'active'
RETURNING id, creator_id, location, activity, date, gender_preference, created_at, updated_at, status;
