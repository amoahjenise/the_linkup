UPDATE users
SET gender = $2,
    date_of_birth = $3,
    avatar = $4,
    updated_at = NOW()
WHERE clerk_user_id = $1
RETURNING *;
