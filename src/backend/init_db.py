"""
Initialize database with sample NFL player data
"""
import csv
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, Player, Position, create_tables
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "nfl_sim")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Sample player data (Top players by position)
SAMPLE_PLAYERS = [
    # Quarterbacks
    {"name": "Patrick Mahomes", "team": "KC", "position": "QB", "rank_overall": 1, "rank_position": 1, "projected_points": 402.5},
    {"name": "Josh Allen", "team": "BUF", "position": "QB", "rank_overall": 2, "rank_position": 2, "projected_points": 398.2},
    {"name": "Jalen Hurts", "team": "PHI", "position": "QB", "rank_overall": 3, "rank_position": 3, "projected_points": 387.1},
    {"name": "Lamar Jackson", "team": "BAL", "position": "QB", "rank_overall": 4, "rank_position": 4, "projected_points": 376.8},
    {"name": "Joe Burrow", "team": "CIN", "position": "QB", "rank_overall": 5, "rank_position": 5, "projected_points": 365.3},
    
    # Running Backs
    {"name": "Christian McCaffrey", "team": "SF", "position": "RB", "rank_overall": 6, "rank_position": 1, "projected_points": 340.7},
    {"name": "Saquon Barkley", "team": "PHI", "position": "RB", "rank_overall": 7, "rank_position": 2, "projected_points": 325.9},
    {"name": "Bijan Robinson", "team": "ATL", "position": "RB", "rank_overall": 8, "rank_position": 3, "projected_points": 318.6},
    {"name": "Breece Hall", "team": "NYJ", "position": "RB", "rank_overall": 9, "rank_position": 4, "projected_points": 310.2},
    {"name": "Jahmyr Gibbs", "team": "DET", "position": "RB", "rank_overall": 10, "rank_position": 5, "projected_points": 302.5},
    
    # Wide Receivers
    {"name": "CeeDee Lamb", "team": "DAL", "position": "WR", "rank_overall": 11, "rank_position": 1, "projected_points": 295.4},
    {"name": "Justin Jefferson", "team": "MIN", "position": "WR", "rank_overall": 12, "rank_position": 2, "projected_points": 290.8},
    {"name": "Tyreek Hill", "team": "MIA", "position": "WR", "rank_overall": 13, "rank_position": 3, "projected_points": 284.6},
    {"name": "Ja'Marr Chase", "team": "CIN", "position": "WR", "rank_overall": 14, "rank_position": 4, "projected_points": 278.3},
    {"name": "Amon-Ra St. Brown", "team": "DET", "position": "WR", "rank_overall": 15, "rank_position": 5, "projected_points": 270.1},
    
    # Tight Ends
    {"name": "Travis Kelce", "team": "KC", "position": "TE", "rank_overall": 16, "rank_position": 1, "projected_points": 262.7},
    {"name": "Mark Andrews", "team": "BAL", "position": "TE", "rank_overall": 17, "rank_position": 2, "projected_points": 254.9},
    {"name": "T.J. Hockenson", "team": "MIN", "position": "TE", "rank_overall": 18, "rank_position": 3, "projected_points": 247.3},
    {"name": "Dallas Goedert", "team": "PHI", "position": "TE", "rank_overall": 19, "rank_position": 4, "projected_points": 240.5},
    {"name": "George Kittle", "team": "SF", "position": "TE", "rank_overall": 20, "rank_position": 5, "projected_points": 234.8},
    
    # Defense
    {"name": "San Francisco 49ers", "team": "SF", "position": "DEF", "rank_overall": 21, "rank_position": 1, "projected_points": 160.5},
    {"name": "Dallas Cowboys", "team": "DAL", "position": "DEF", "rank_overall": 22, "rank_position": 2, "projected_points": 155.2},
    {"name": "Philadelphia Eagles", "team": "PHI", "position": "DEF", "rank_overall": 23, "rank_position": 3, "projected_points": 151.8},
    {"name": "New York Jets", "team": "NYJ", "position": "DEF", "rank_overall": 24, "rank_position": 4, "projected_points": 148.3},
    {"name": "Buffalo Bills", "team": "BUF", "position": "DEF", "rank_overall": 25, "rank_position": 5, "projected_points": 145.1},
    
    # Kickers
    {"name": "Justin Tucker", "team": "BAL", "position": "K", "rank_overall": 26, "rank_position": 1, "projected_points": 140.8},
    {"name": "Harrison Butker", "team": "KC", "position": "K", "rank_overall": 27, "rank_position": 2, "projected_points": 137.4},
    {"name": "Evan McPherson", "team": "CIN", "position": "K", "rank_overall": 28, "rank_position": 3, "projected_points": 134.9},
    {"name": "Jake Elliott", "team": "PHI", "position": "K", "rank_overall": 29, "rank_position": 4, "projected_points": 132.6},
    {"name": "Tyler Bass", "team": "BUF", "position": "K", "rank_overall": 30, "rank_position": 5, "projected_points": 130.2},
]

def init_db():
    """Initialize database with tables and sample data"""
    # Create tables
    create_tables()
    
    # Add sample player data
    session = Session()
    
    # Check if players table already has data
    player_count = session.query(Player).count()
    if player_count > 0:
        print(f"Database already contains {player_count} players. Skipping initialization.")
        return
    
    for player_data in SAMPLE_PLAYERS:
        position_value = player_data["position"]
        position_enum = getattr(Position, position_value)
        
        player = Player(
            name=player_data["name"],
            team=player_data["team"],
            position=position_enum,
            rank_overall=player_data["rank_overall"],
            rank_position=player_data["rank_position"],
            projected_points=player_data["projected_points"]
        )
        session.add(player)
    
    session.commit()
    print(f"Added {len(SAMPLE_PLAYERS)} sample players to the database.")

if __name__ == "__main__":
    init_db()
