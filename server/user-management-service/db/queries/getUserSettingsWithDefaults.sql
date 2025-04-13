-- getUserSettingsWithDefaults.sql
-- Retrieves user settings or returns default values if none exist
SELECT 
    COALESCE(us.distance_range, ARRAY[0, 50]) AS "distanceRange",
    COALESCE(us.age_range, ARRAY[18, 99]) AS "ageRange",
    COALESCE(us.gender_preferences, ARRAY['Men', 'Women']) AS "genderPreferences",
    COALESCE(us.notification_enabled, true) AS "notificationEnabled",
    COALESCE(us.location_sharing_enabled, true) AS "locationSharingEnabled"
FROM 
    users u
LEFT JOIN 
    user_settings us ON u.id = us.user_id
WHERE 
    u.id = :userId;