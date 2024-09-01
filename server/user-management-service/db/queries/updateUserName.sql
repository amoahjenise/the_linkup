UPDATE users
SET name = $1, updated_at = NOW()
WHERE id = $2::uuid
RETURNING name;
