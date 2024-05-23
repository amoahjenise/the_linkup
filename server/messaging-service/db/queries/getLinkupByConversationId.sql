-- getLinkupByConversation.sql

SELECT conversations.*, users.*, link_ups.*, link_up_requests.id as request_id, link_up_requests.status as request_status
FROM conversations
INNER JOIN users ON conversations.operator_id = users.id
INNER JOIN link_ups ON conversations.linkup_id = link_ups.id
INNER JOIN link_up_requests ON conversations.requester_id = link_up_requests.requester_id 
AND conversations.linkup_id = link_up_requests.linkup_id 
WHERE conversations.conversation_id = $1  
  AND link_ups.hidden <> true
  AND link_ups.status <> 'inactive'
ORDER BY link_ups.created_at DESC;

