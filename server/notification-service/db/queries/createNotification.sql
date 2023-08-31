 INSERT INTO notifications (user_id, requester_id, notification_type, content, link_up_id)
    VALUES ($1::uuid, $2::uuid, $3, $4, $5::uuid)
    RETURNING id;