CREATE DATABASE connectfour;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('nate', 'nathan.hishon@gmail.com', 'password')