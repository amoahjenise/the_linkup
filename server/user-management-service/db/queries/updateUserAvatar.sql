UPDATE users
SET avatar = $1, updated_at = NOW()
WHERE id = $2
RETURNING avatar;
