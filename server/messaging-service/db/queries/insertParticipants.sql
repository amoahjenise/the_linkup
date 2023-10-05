-- insertParticipants.sql

INSERT INTO participants (conversation_id, user_id)
VALUES ($1::uuid, $2::uuid);
