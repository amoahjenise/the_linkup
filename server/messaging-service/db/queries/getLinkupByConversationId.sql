SELECT 
  conversations.*, 
  operator_users.*, 
  requester_users.name   AS requester_name, 
  requester_users.avatar AS requester_avatar, 
  link_ups.*, 
  link_up_requests.id AS request_id, 
  link_up_requests.status AS request_status
FROM 
  conversations
INNER JOIN 
  users AS operator_users ON conversations.operator_id = operator_users.id
INNER JOIN 
  users AS requester_users ON conversations.requester_id = requester_users.id
INNER JOIN 
  link_ups ON conversations.linkup_id = link_ups.id
INNER JOIN 
  link_up_requests ON conversations.requester_id = link_up_requests.requester_id 
  AND conversations.linkup_id = link_up_requests.linkup_id 
WHERE 
  conversations.conversation_id = $1  
  AND link_ups.hidden <> true
  AND link_ups.status <> 'inactive'
ORDER BY 
  link_ups.created_at DESC;
