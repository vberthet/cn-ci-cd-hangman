CREATE TABLE word (
    id       BIGINT      NOT NULL AUTO_INCREMENT,
    text     VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_word_text UNIQUE (text)
);

CREATE TABLE game (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    player_name     VARCHAR(50) NOT NULL,
    word_id         BIGINT      NOT NULL,
    -- Letters guessed so far, in the order they were played (e.g. "eahn").
    guessed_letters VARCHAR(26) NOT NULL,
    status          VARCHAR(20) NOT NULL,
    started_at      DATETIME(6) NOT NULL,
    finished_at     DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_game_word FOREIGN KEY (word_id) REFERENCES word (id)
);

CREATE INDEX idx_game_started_at ON game (started_at);
