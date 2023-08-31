WITH updated_request AS (
  UPDATE link_up_requests
  SET status = 'declined'
  WHERE id = $1::uuid
  RETURNING linkup_id
)
UPDATE link_ups AS lu
SET status = 'declined'
FROM updated_request ur
WHERE lu.id = ur.linkup_id
RETURNING lu.id, lu.creator_name, lu.activity, lu.location, lu.date AS link_up_date;

