-- SQL script to update the Instagram access token for a specific user
-- Replace `your_token_here` with the actual access token you want to insert
-- The $1 parameter represents the UUID of the user

UPDATE users
SET instagram_access_token = $2
WHERE id = $1::uuid
RETURNING instagram_access_token;


