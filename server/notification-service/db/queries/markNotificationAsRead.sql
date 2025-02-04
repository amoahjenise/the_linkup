    UPDATE notifications
    SET is_read = true
    WHERE id = $1::uuid;