INSERT INTO link_ups (id, creator_id, creator_name, location, activity, date, gender_preference, payment_option, created_at, updated_at, status)
VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, now(), now(), 'active')
RETURNING 
    link_ups.*,
    (SELECT avatar FROM users WHERE users.id = $1::uuid) AS avatar,
    (SELECT latitude FROM users WHERE users.id = $1::uuid) AS latitude,
    (SELECT longitude FROM users WHERE users.id = $1::uuid) AS longitude,
    (SELECT date_of_birth FROM users WHERE users.id = $1::uuid) AS date_of_birth,
    (SELECT gender FROM users WHERE users.id = $1::uuid) AS creator_gender,
    (SELECT is_online FROM users WHERE users.id = $1::uuid) AS is_online;