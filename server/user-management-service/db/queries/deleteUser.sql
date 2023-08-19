WITH deactivated_user AS (
  UPDATE users
  SET status = 'inactive', updated_at = NOW()
  WHERE id = $1
  RETURNING *
)
UPDATE link_ups
SET status = 'inactive', updated_at = NOW()
WHERE creator_id = (SELECT id FROM deactivated_user LIMIT 1);
