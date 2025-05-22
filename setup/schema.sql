-- Create player table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(20) NOT NULL,
    team VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create yearly stats table
CREATE TABLE IF NOT EXISTS yearly_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    season INTEGER NOT NULL,
    games_played INTEGER,
    passing_yards INTEGER,
    passing_tds INTEGER,
    interceptions INTEGER,
    rushing_yards INTEGER,
    rushing_tds INTEGER,
    receptions INTEGER,
    receiving_yards INTEGER,
    receiving_tds INTEGER,
    fumbles INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game stats table
CREATE TABLE IF NOT EXISTS game_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    game_date DATE NOT NULL,
    opponent VARCHAR(3) NOT NULL,
    passing_yards INTEGER,
    passing_tds INTEGER,
    interceptions INTEGER,
    rushing_yards INTEGER,
    rushing_tds INTEGER,
    receptions INTEGER,
    receiving_yards INTEGER,
    receiving_tds INTEGER,
    fumbles INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projections table
CREATE TABLE IF NOT EXISTS projections (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    opponent VARCHAR(3) NOT NULL,
    projected_points DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_team ON players(team);
CREATE INDEX idx_yearly_stats_season ON yearly_stats(season);
CREATE INDEX idx_game_stats_game_date ON game_stats(game_date);
CREATE INDEX idx_projections_season_week ON projections(season, week);
