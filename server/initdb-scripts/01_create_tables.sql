-- Create 'users' table
CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    phone_number character varying(20) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    gender character varying(10) COLLATE pg_catalog."default",
    date_of_birth date,
    password character varying(255) COLLATE pg_catalog."default",
    link_up_score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    bio character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    status character varying(10) COLLATE pg_catalog."default" DEFAULT 'active'::character varying,
    avatar text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_phone_number_key UNIQUE (phone_number)
);

-- Create 'link_ups' table
CREATE TABLE IF NOT EXISTS public.link_ups
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    creator_id uuid,
    location text COLLATE pg_catalog."default",
    activity character varying(255) COLLATE pg_catalog."default",
    date timestamp with time zone,
    gender_preference character varying(10) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status character varying(255) COLLATE pg_catalog."default",
    creator_name text COLLATE pg_catalog."default",
    CONSTRAINT link_ups_pkey PRIMARY KEY (id),
    CONSTRAINT link_ups_creator_id_fkey FOREIGN KEY (creator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Create 'link_up_requests' table
CREATE TABLE IF NOT EXISTS public.link_up_requests
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    linkup_id uuid,
    receiver_id uuid,
    status character varying(20) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    message text COLLATE pg_catalog."default",
    requester_id uuid,
    CONSTRAINT link_up_requests_pkey PRIMARY KEY (id),
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_requester FOREIGN KEY (requester_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT link_up_requests_link_up_id_fkey FOREIGN KEY (linkup_id)
        REFERENCES public.link_ups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT link_up_requests_user_id_fkey FOREIGN KEY (receiver_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Create 'images' table
CREATE TABLE IF NOT EXISTS public.images
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    image_url text COLLATE pg_catalog."default",
    is_avatar boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT images_pkey PRIMARY KEY (id),
    CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Create 'conversations' table
CREATE TABLE IF NOT EXISTS public.conversations
(
    conversation_id uuid NOT NULL,
    participants uuid[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    last_message text COLLATE pg_catalog."default",
    unread_count integer,
    archived boolean,
    muted boolean,
    pinned boolean,
    notifications_enabled boolean,
    CONSTRAINT conversations_pkey PRIMARY KEY (conversation_id)
);

-- Create 'messages' table
CREATE TABLE IF NOT EXISTS public.messages
(
    message_id uuid NOT NULL,
    conversation_id uuid,
    sender_id uuid,
    content text COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone,
    is_read boolean,
    is_system_message boolean,
    attachments json,
    CONSTRAINT messages_pkey PRIMARY KEY (message_id),
    CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id)
        REFERENCES public.conversations (conversation_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Create 'notifications' table
CREATE TABLE IF NOT EXISTS public.notifications
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    type character varying(255) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default",
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    requester_id uuid,
    link_up_id uuid,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Create 'participants' table
CREATE TABLE IF NOT EXISTS public.participants
(
    participant_id uuid NOT NULL,
    user_id uuid,
    conversation_id uuid,
    last_read_message_id uuid,
    is_muted boolean,
    is_blocked boolean,
    joined_at timestamp without time zone,
    CONSTRAINT participants_pkey PRIMARY KEY (participant_id),
    CONSTRAINT participants_conversation_id_fkey FOREIGN KEY (conversation_id)
        REFERENCES public.conversations (conversation_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Create 'ratings' table
CREATE TABLE IF NOT EXISTS public.ratings
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    link_up_id uuid,
    user_id uuid,
    rating integer,
    reason text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ratings_pkey PRIMARY KEY (id),
    CONSTRAINT ratings_link_up_id_fkey FOREIGN KEY (link_up_id)
        REFERENCES public.link_ups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
