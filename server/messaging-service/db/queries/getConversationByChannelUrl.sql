-- getConversationByChannelUrl.sql

SELECT * 
FROM conversations 
WHERE conversation_id = $1;
