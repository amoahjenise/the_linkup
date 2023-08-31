WITH updated_linkup_request AS (
  UPDATE link_up_requests
  SET status = 'accepted'
  WHERE id = $1::uuid
  RETURNING linkup_id
)
UPDATE link_ups AS lu
SET status = 'accepted'
FROM updated_linkup_request ul
WHERE lu.id = ul.linkup_id
RETURNING lu.id, lu.creator_name, lu.activity, lu.location, lu.date AS link_up_date;
