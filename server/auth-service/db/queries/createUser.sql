INSERT INTO users (clerk_user_id, phone_number, status) 
VALUES ($1, $2, 'active') RETURNING id, clerk_user_id, phone_number;