UPDATE link_ups
SET status = 'inactive', updated_at = now()
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
    link_ups.status;