UPDATE users
SET is_online = $1, updated_at = NOW()
WHERE id = $2::uuid
RETURNING *;

