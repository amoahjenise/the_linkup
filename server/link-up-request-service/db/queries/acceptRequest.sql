WITH updated_linkup_request AS (
  UPDATE link_up_requests
  SET status = 'accepted'
  WHERE id = $1::uuid
  RETURNING *
)
SELECT lr.*, lu.activity, lu.creator_name
FROM updated_linkup_request lr
JOIN link_ups lu ON lr.linkup_id = lu.id;
