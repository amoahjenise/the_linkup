SELECT *
FROM users
WHERE clerk_user_id = $1
AND status = 'active';
