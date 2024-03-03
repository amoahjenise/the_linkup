UPDATE link_ups
SET location = $1,
    activity = $2,
    date = $3,
    gender_preference = $4,
    payment_option = $5,
    updated_at = now()
WHERE id = $6
RETURNING id, creator_id, location, activity, date, gender_preference, payment_option, created_at, updated_at status;
