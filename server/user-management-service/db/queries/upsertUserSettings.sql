-- upsertUserSettings.sql
-- Now includes validation for gender preferences
INSERT INTO user_settings (
    user_id,
    distance_range,
    age_range,
    gender_preferences,
    notification_enabled,
    location_sharing_enabled
) VALUES (
    :userId,
    :distanceRange,
    :ageRange,
    -- Ensure only valid gender preferences are stored
    (SELECT array_agg(gender) 
     FROM unnest(:genderPreferences::TEXT[]) AS gender
     WHERE gender = ANY(
        ARRAY[
            'Men', 'Women', 'Agender', 'Androgynous', 'Bigender', 
            'Crossdresser', 'Demiboy', 'Demigirl', 'Gender Nonconforming',
            'Gender questioning', 'Genderqueer', 'Genderfluid', 'Gender variant',
            'Intersex', 'Neutrois', 'Non-binary', 'Pangender', 'Transfeminine',
            'Transgender', 'Transmasculine', 'Third gender', 'Two-Spirit'
        ]::TEXT[]
     )),
    :notificationEnabled,
    :locationSharingEnabled
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