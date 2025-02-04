UPDATE users
SET access_token = $2, updated_at = NOW()
WHERE id = $1::uuid
RETURNING *;
