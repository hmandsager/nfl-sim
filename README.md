# Fantasy Football Draft Simulator Database

This project provides a PostgreSQL database schema for a fantasy football draft simulator.


## Setup

1. Install dependencies:
```bash
uv venv
uv pip install -r src/backend/requirements.txt
```

2. Initialize the database:
```bash
python init_db.py
```

3. Run the Flask server:
```bash
python app.py
```

4. Run the React app:
```bash
cd src/frontend
npm install
npm start
```
