"""
Flask API for NFL Fantasy Draft Simulator
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "nfl_sim")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route("/api/players", methods=["GET"])
def get_players():
    """Get all players from database with optional position filter"""
    position = request.args.get("position", None)
    
    query = "SELECT * FROM players"
    if position:
        query += f" WHERE position = '{position}'"
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text(query))
            players = [dict(row._mapping) for row in result]
            return jsonify(players), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/positions", methods=["GET"])
def get_positions():
    """Get all unique positions"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT DISTINCT position FROM players"))
            positions = [dict(row._mapping)["position"] for row in result]
            return jsonify(positions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/draft-settings", methods=["POST"])
def save_draft_settings():
    """Save draft settings"""
    settings = request.json
    # In a real app, you might save these to the database
    # For now, we'll just return them
    return jsonify(settings), 201

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
