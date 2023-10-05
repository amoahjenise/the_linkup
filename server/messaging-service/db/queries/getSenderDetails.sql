SELECT name as sender_name, avatar as sender_avatar
FROM users
WHERE id = $1::uuid;
