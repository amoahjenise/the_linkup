-- upsertUserSettings.sql
-- Removes gender preference validation, allows any values

INSERT INTO user_settings (
    user_id,
    distance_range,
    age_range,
    gender_preferences,
    notification_enabled,
    location_sharing_enabled
)
VALUES (
    $1, -- user_id
    $2, -- distance_range
    $3, -- age_range
    COALESCE(
        CASE WHEN $4::TEXT[] IS NULL THEN ARRAY[]::TEXT[] ELSE $4::TEXT[] END, 
        ARRAY[]::TEXT[]
    ), -- gender_preferences (no validation)
    COALESCE($5, true),  -- notification_enabled with default
    COALESCE($6, false)  -- location_sharing_enabled with default
)
ON CONFLICT (user_id)
DO UPDATE SET
    distance_range = EXCLUDED.distance_range,
    age_range = EXCLUDED.age_range,
    gender_preferences = EXCLUDED.gender_preferences,
    notification_enabled = EXCLUDED.notification_enabled,
    location_sharing_enabled = EXCLUDED.location_sharing_enabled,
    updated_at = CURRENT_TIMESTAMP
RETURNING *;
