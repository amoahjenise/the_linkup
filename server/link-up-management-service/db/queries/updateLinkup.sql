UPDATE link_ups
SET location = $1,
    activity = $2,
    date = $3,
    time = $4,
    gender_preference = $5,
    updated_at = now()
WHERE id = $6
RETURNING id, creator_id, location, activity, date, time, gender_preference, created_at, updated_at;
