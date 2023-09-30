SELECT id 
FROM link_up_requests 
WHERE linkup_id = $1::uuid 
  AND requester_id = $2::uuid
ORDER BY
link_up_requests.created_at DESC;