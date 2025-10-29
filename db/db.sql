CREATE TABLE auth_db.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

insert into auth_db.users (id, email, password_hash) values (1, 'test@test.com', 'test123');

select * from auth_db.users;