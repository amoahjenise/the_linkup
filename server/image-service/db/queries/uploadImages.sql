-- Use the RETURNING clause to return the inserted row
INSERT INTO images (user_id, image_url)
VALUES ($1::uuid, $2)
RETURNING *; 