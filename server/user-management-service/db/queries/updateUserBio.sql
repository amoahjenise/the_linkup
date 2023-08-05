UPDATE users
SET bio = $1
WHERE id = $2
RETURNING bio;
