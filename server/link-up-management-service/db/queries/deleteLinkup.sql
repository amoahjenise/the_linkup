WITH updated_link_up AS (
  UPDATE link_ups
  SET status = 'inactive',
      updated_at = NOW()
  WHERE id = $1::uuid
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
    (SELECT latitude FROM users WHERE users.id = link_ups.creator_id) AS latitude,
    (SELECT longitude FROM users WHERE users.id = link_ups.creator_id) AS longitude,
    (SELECT date_of_birth FROM users WHERE users.id = link_ups.creator_id) AS date_of_birth,
    (SELECT gender FROM users WHERE users.id = link_ups.creator_id) AS creator_gender
),
updated_requests AS (
  UPDATE link_up_requests
  SET status = 'inactive' 
  FROM updated_link_up
  WHERE link_up_requests.linkup_id = updated_link_up.id
    AND link_up_requests.status <> 'completed'
)
SELECT * FROM updated_link_up*
