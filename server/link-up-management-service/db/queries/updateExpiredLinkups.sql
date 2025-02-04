WITH updated_link_ups AS (
  -- Update the link_ups table
  UPDATE link_ups
  SET status = 'expired'
  WHERE date <= NOW()
    AND status = 'active'
  RETURNING id, activity, creator_id
),
updated_link_up_requests AS (
  -- Update the link_up_requests table based on the expired linkups
  UPDATE link_up_requests AS lur
  SET status = 'expired'
  FROM updated_link_ups AS el
  WHERE lur.linkup_id = el.id
    AND lur.status <> 'completed'
)
SELECT * FROM updated_link_ups;
