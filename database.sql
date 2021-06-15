CREATE DATABASE connectfour;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('nate', 'nathan.hishon@gmail.com', 'password')


CREATE TABLE games(
    game_id SERIAL PRIMARY KEY,
    unique_id VARCHAR(255),
    status VARCHAR(255),
    saved_game jsonb,
    current_turn boolean,
    player_one_id integer not null references users(user_id),
    player_two_id integer references users(user_id)
);