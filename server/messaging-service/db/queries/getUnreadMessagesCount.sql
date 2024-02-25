SELECT 
  COUNT(messages.message_id) AS total_unread_count
FROM conversations
INNER JOIN link_ups ON conversations.linkup_id = link_ups.id
LEFT JOIN messages ON conversations.conversation_id = messages.conversation_id
                  AND messages.receiver_id = $1
WHERE messages.is_read = false;
