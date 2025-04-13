-- resetUserSettingsToDefault.sql
-- Resets user settings to default values by deleting their record
DELETE FROM 
    user_settings
WHERE 
    user_id = $1
RETURNING 
    id;