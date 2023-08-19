UPDATE users
SET status = 'active', updated_at = NOW()
WHERE id = $1
RETURNING id;
