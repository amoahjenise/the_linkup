CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender TEXT,  -- Changed to TEXT without limit
    date_of_birth DATE,
    password VARCHAR(255) NOT NULL,
    link_up_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    status VARCHAR(20),
    avatar TEXT,
    clerk_user_id VARCHAR(255) UNIQUE,
    access_token VARCHAR(255),
    city VARCHAR(255),
    latitude NUMERIC,
    longitude NUMERIC,
    allow_location BOOLEAN DEFAULT FALSE,
    country VARCHAR(255),
    instagram_access_token VARCHAR(255),    
    instagram_url TEXT,  
    facebook_url TEXT,   
    twitter_url TEXT    
);

-- Table: link_ups
CREATE TABLE IF NOT EXISTS link_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id),
    location VARCHAR(255),
    activity VARCHAR(255),
    date TIMESTAMP,
    gender_preference TEXT[],  -- Changed to a TEXT array
    payment_option VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    creator_name VARCHAR(100),
    hidden BOOLEAN DEFAULT FALSE
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
    requester_id UUID REFERENCES users(id),
    hidden BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_user_linkup_request UNIQUE (requester_id, linkup_id)  -- ✅ Enforce single request per user per linkup
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operator_id UUID,
    request_id UUID REFERENCES link_up_requests(id),
    linkup_id UUID REFERENCES link_ups(id),
    requester_id UUID REFERENCES users(id)
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requester_id UUID REFERENCES users(id),
    link_up_id UUID REFERENCES link_ups(id),
    hidden BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(255)
);

-- Table: user_settings
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    distance_range INT[] DEFAULT ARRAY[0, 50],
    age_range INT[] DEFAULT ARRAY[18, 99],
    gender_preferences TEXT[] DEFAULT ARRAY['Men', 'Women'],
    notification_enabled BOOLEAN DEFAULT TRUE,
    location_sharing_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);