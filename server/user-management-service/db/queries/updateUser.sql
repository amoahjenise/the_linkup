UPDATE users
SET name = $2,
    gender = $3,
    date_of_birth = $4,
    avatar = $5,
    updated_at = NOW()
WHERE clerk_user_id = $1
RETURNING *;
