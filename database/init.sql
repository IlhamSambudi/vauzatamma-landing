-- Vauza Tamma DB Initialization Script

-- 1. Master Tables (No Dependencies)

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100), -- 'Makkah', 'Madinah', 'Istanbul', dll.
    country VARCHAR(100),
    star_rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Core Packages Table (Depends on airlines)

CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    package_code VARCHAR(50) UNIQUE,
    package_name VARCHAR(255) NOT NULL,
    program_type VARCHAR(50) DEFAULT 'umroh', -- 'umroh', 'haji', 'tour'
    plus_destination VARCHAR(100), -- ex: 'Istanbul', 'Dubai'
    airline_id INT REFERENCES airlines(id) ON DELETE SET NULL,
    description TEXT,
    full_seat INT,
    remaining_seat INT,
    starting VARCHAR(100), -- Lokasi keberangkatan (contoh: Jakarta)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Package Dependent Tables (Depends on packages)

CREATE TABLE package_departures (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL
);

CREATE TABLE package_prices (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL, -- 'quad', 'triple', 'double'
    price NUMERIC NOT NULL,
    upgrade_double NUMERIC DEFAULT 0,
    upgrade_triple NUMERIC DEFAULT 0
);

CREATE TABLE package_features (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    feature TEXT NOT NULL
);

CREATE TABLE package_hotels (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    stay_city VARCHAR(100), -- 'makkah', 'madinah'
    nights INT DEFAULT 0
);

CREATE TABLE package_assets (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    asset_type VARCHAR(50), -- 'cover', 'flyer', 'gallery'
    asset_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    pdf_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Independent / CMS Support Tables

CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    package_interest VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_library (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(100), -- 'image', 'video', 'document'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100),
    message TEXT NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seeding Default Minimal Data

INSERT INTO admins (username, password_hash) VALUES ('admin', 'placeholder_hash');

INSERT INTO airlines (name, code) VALUES 
('Emirates', 'EK'), 
('Saudia Airlines', 'SV');

INSERT INTO hotels (name, city, country, star_rating) VALUES 
('Pullman Zamzam', 'Makkah', 'Saudi Arabia', 5), 
('Anwar Al Madinah Mövenpick', 'Madinah', 'Saudi Arabia', 5);
