-- getUserSettingsWithDefaults.sql
-- Retrieves user settings or returns default values if none exist
-- Ensures consistent lowercase gender preferences
SELECT 
    COALESCE(us.distance_range, ARRAY[0, 50]) AS distance_range,
    COALESCE(us.age_range, ARRAY[18, 99]) AS age_range,
    (
        SELECT ARRAY(
            SELECT LOWER(trim(gender))
            FROM unnest(COALESCE(us.gender_preferences, ARRAY['men', 'women']::text[])) AS gender
        )
    ) AS gender_preferences,
    COALESCE(us.notification_enabled, true) AS notification_enabled,
    COALESCE(us.location_sharing_enabled, false) AS location_sharing_enabled
FROM 
    users u
LEFT JOIN 
    user_settings us ON u.id = us.user_id
WHERE 
    u.id = $1;