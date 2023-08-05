-- createUser.sql 
INSERT INTO users (phone_number, password, name, gender, date_of_birth, avatar) 
VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, phone_number, name, gender, date_of_birth, link_up_score, created_at, updated_at, avatar;