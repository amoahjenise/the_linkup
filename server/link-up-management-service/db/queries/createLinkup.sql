INSERT INTO link_ups (id, creator_id, creator_name, location, activity, date, gender_preference, payment_option, created_at, updated_at, status)
VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, now(), now(), 'active')
RETURNING 
    link_ups.id,
    link_ups.creator_id,
    link_ups.creator_name,
    link_ups.location,
    link_ups.activity,
    link_ups.date,
    link_ups.gender_preference,
    link_ups.created_at,
    link_ups.updated_at,
    link_ups.status,
    (SELECT avatar FROM users WHERE users.id = $1::uuid) AS avatar,
    (SELECT latitude FROM users WHERE users.id = $1::uuid) AS latitude,
    (SELECT longitude FROM users WHERE users.id = $1::uuid) AS longitude,
    (SELECT date_of_birth FROM users WHERE users.id = $1::uuid) AS date_of_birth,
    (SELECT gender FROM users WHERE users.id = $1::uuid) AS creator_gender;