UPDATE link_ups
SET location = $1,
    activity = $2,
    date = $3,
    gender_preference = $4,
    updated_at = now()
WHERE id = $5
RETURNING id, creator_id, location, activity, date, gender_preference, created_at, updated_at status;
