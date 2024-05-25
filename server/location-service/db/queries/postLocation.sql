UPDATE users 
SET city = $2, 
    country = $3, 
    latitude = $4, 
    longitude = $5, 
    allow_location = $6
WHERE id = $1
RETURNING *;