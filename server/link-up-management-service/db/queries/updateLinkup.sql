UPDATE link_ups
SET location = $1,
    activity = $2,
    date = $3,
    gender_preference = $4,
    payment_option = $5,
    updated_at = now()
WHERE id = $6
RETURNING 
    link_ups.id,
    link_ups.creator_id,
    link_ups.creator_name,
    link_ups.location,
    link_ups.activity,
    link_ups.date,
    link_ups.gender_preference,
    link_ups.payment_option,
    link_ups.created_at,
    link_ups.updated_at,
    link_ups.status,
    (SELECT latitude FROM users WHERE users.id = link_ups.creator_id) AS latitude,
    (SELECT longitude FROM users WHERE users.id = link_ups.creator_id) AS longitude,
    (SELECT date_of_birth FROM users WHERE users.id = link_ups.creator_id) AS date_of_birth,
    (SELECT gender FROM users WHERE users.id = link_ups.creator_id) AS creator_gender,
    (SELECT avatar FROM users WHERE users.id = link_ups.creator_id) AS avatar,
    (SELECT is_online FROM users WHERE users.id = link_ups.creator_id) AS is_online;