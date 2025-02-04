UPDATE users
SET bio = $2, updated_at = NOW()
WHERE id = $1::uuid
RETURNING bio;
