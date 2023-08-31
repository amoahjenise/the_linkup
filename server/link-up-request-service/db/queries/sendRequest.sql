INSERT INTO link_up_requests (requester_id, receiver_id, linkup_id, status, message)
VALUES ($1, $2, $3, 'pending', $4)
RETURNING
    id,
    linkup_id,
    receiver_id,
    status,
    created_at,
    updated_at,
    message,
    requester_id;
