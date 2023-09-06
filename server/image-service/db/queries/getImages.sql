SELECT image_url
FROM images
WHERE user_id = $1::uuid;