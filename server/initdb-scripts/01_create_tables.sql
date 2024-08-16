CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    password VARCHAR(255) NOT NULL,
    link_up_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    status VARCHAR(20),
    avatar TEXT,
    clerk_user_id UUID UNIQUE
);

-- Table: link_ups
CREATE TABLE IF NOT EXISTS link_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id),
    location VARCHAR(255),
    activity VARCHAR(255),
    date TIMESTAMP,
    gender_preference VARCHAR(10),
    payment_option VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    creator_name VARCHAR(100)
);

-- Table: link_up_requests
CREATE TABLE IF NOT EXISTS link_up_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    linkup_id UUID REFERENCES link_ups(id),
    receiver_id UUID REFERENCES users(id),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT,
    requester_id UUID REFERENCES users(id)
);

-- Table: images
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    image_url TEXT,
    is_avatar BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operator_id UUID,
    request_id UUID REFERENCES link_up_requests(id),
    linkup_id UUID REFERENCES link_ups(id)
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requester_id UUID REFERENCES users(id),
    link_up_id UUID REFERENCES link_ups(id)
);
