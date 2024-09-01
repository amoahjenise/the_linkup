 INSERT INTO notifications (user_id, requester_id, notification_type, content, link_up_id, linkup_request_id)
    VALUES ($1::uuid, $2::uuid, $3, $4, $5::uuid, $6::uuid)
    RETURNING id;