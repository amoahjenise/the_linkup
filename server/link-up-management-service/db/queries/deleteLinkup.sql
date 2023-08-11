UPDATE link_ups
SET status = 'inactive', updated_at = now()
WHERE id = $1;