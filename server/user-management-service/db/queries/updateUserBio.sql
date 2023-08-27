UPDATE users
SET bio = $1, updated_at = NOW()
WHERE id = $2::uuid
RETURNING bio;
