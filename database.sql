CREATE DATABASE connectfour;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);


CREATE TABLE games(
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    saved_game jsonb,
    current_turn boolean,
    player_one_id integer not null references users(user_id),
    player_two_id integer references users(user_id)
);