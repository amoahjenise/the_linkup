UPDATE conversations
SET unread_count = unread_count + 1
WHERE conversation_id = $1::uuid;
