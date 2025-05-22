"""
Database models for the NFL Fantasy Draft Simulator
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum
import os
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

Base = declarative_base()

class Position(enum.Enum):
    """NFL player positions"""
    QB = "QB"
    RB = "RB"
    WR = "WR"
    TE = "TE"
    DEF = "DEF"
    K = "K"


class Player(Base):
    """NFL player model"""
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    team = Column(String(50), nullable=False)
    position = Column(Enum(Position), nullable=False)
    rank_overall = Column(Integer)
    rank_position = Column(Integer)
    projected_points = Column(Float)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "team": self.team,
            "position": self.position.value,
            "rank_overall": self.rank_overall,
            "rank_position": self.rank_position,
            "projected_points": self.projected_points
        }


class DraftSettings(Base):
    """Draft settings model"""
    __tablename__ = "draft_settings"
    
    id = Column(Integer, primary_key=True)
    draft_type = Column(String(50), nullable=False, default="snake")
    num_teams = Column(Integer, nullable=False, default=10)
    draft_position = Column(Integer, nullable=True)
    is_random_position = Column(Integer, default=0)
    qb_count = Column(Integer, default=1)
    rb_count = Column(Integer, default=2)
    wr_count = Column(Integer, default=2)
    te_count = Column(Integer, default=1)
    flex_count = Column(Integer, default=1)
    def_count = Column(Integer, default=1)
    k_count = Column(Integer, default=1)
    bench_count = Column(Integer, default=6)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "draft_type": self.draft_type,
            "num_teams": self.num_teams,
            "draft_position": self.draft_position,
            "is_random_position": bool(self.is_random_position),
            "qb_count": self.qb_count,
            "rb_count": self.rb_count,
            "wr_count": self.wr_count,
            "te_count": self.te_count,
            "flex_count": self.flex_count,
            "def_count": self.def_count,
            "k_count": self.k_count,
            "bench_count": self.bench_count
        }


class DraftPick(Base):
    """Draft pick model"""
    __tablename__ = "draft_picks"
    
    id = Column(Integer, primary_key=True)
    draft_id = Column(Integer, nullable=False)
    round_num = Column(Integer, nullable=False)
    pick_num = Column(Integer, nullable=False)
    team_num = Column(Integer, nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"))
    player = relationship("Player")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "draft_id": self.draft_id,
            "round_num": self.round_num,
            "pick_num": self.pick_num,
            "team_num": self.team_num,
            "player_id": self.player_id,
            "player": self.player.to_dict() if self.player else None
        }


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(engine)


if __name__ == "__main__":
    create_tables()
