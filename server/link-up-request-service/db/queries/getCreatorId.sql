-- getCreatorId.sql
SELECT creator_name
FROM link_ups
WHERE id = $1;
