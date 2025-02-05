UPDATE users 
SET 
    instagram_url = COALESCE($2, instagram_url),
    facebook_url = COALESCE($3, facebook_url),
    twitter_url = COALESCE($4, twitter_url)
WHERE id = $1
RETURNING id, instagram_url, facebook_url, twitter_url;
