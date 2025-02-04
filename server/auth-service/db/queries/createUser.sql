INSERT INTO users (clerk_user_id, name, phone_number, status) 
VALUES ($1, $2, $3, 'active') RETURNING id, name, clerk_user_id, phone_number;