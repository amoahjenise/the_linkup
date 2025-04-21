UPDATE users
SET 
  name = $2,
  avatar = $3,
  updated_at = NOW()
WHERE clerk_user_id = $1
RETURNING *;