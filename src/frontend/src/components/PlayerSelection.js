import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Mock API service (to be replaced with actual API calls)
const fetchPlayers = async (position = null) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // This is a placeholder. In the real app, this would call the backend API
  // return axios.get(`/api/players${position ? `?position=${position}` : ''}`);
  
  // For now, return mock data
  const mockPlayers = [
    { id: 1, name: "Patrick Mahomes", team: "KC", position: "QB", rank_overall: 1, rank_position: 1, projected_points: 402.5 },
    { id: 2, name: "Josh Allen", team: "BUF", position: "QB", rank_overall: 2, rank_position: 2, projected_points: 398.2 },
    { id: 3, name: "Jalen Hurts", team: "PHI", position: "QB", rank_overall: 3, rank_position: 3, projected_points: 387.1 },
    { id: 4, name: "Lamar Jackson", team: "BAL", position: "QB", rank_overall: 4, rank_position: 4, projected_points: 376.8 },
    { id: 5, name: "Joe Burrow", team: "CIN", position: "QB", rank_overall: 5, rank_position: 5, projected_points: 365.3 },
    { id: 6, name: "Christian McCaffrey", team: "SF", position: "RB", rank_overall: 6, rank_position: 1, projected_points: 340.7 },
    { id: 7, name: "Saquon Barkley", team: "PHI", position: "RB", rank_overall: 7, rank_position: 2, projected_points: 325.9 },
    { id: 8, name: "Bijan Robinson", team: "ATL", position: "RB", rank_overall: 8, rank_position: 3, projected_points: 318.6 },
    { id: 9, name: "Breece Hall", team: "NYJ", position: "RB", rank_overall: 9, rank_position: 4, projected_points: 310.2 },
    { id: 10, name: "Jahmyr Gibbs", team: "DET", position: "RB", rank_overall: 10, rank_position: 5, projected_points: 302.5 },
  ];
  
  if (position) {
    return mockPlayers.filter(player => player.position === position);
  }
  
  return mockPlayers;
};

const PlayerSelection = ({ onSelectPlayer, currentTeam, userTeamNumber, currentRound, draftSettings, userTeam }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [autoPickTimer, setAutoPickTimer] = useState(null);
  
  const isUserTurn = currentTeam === userTeamNumber;
  
  // Get available positions
  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'DEF', 'K'];
  
  // Load players when component mounts
  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayers();
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayers();
  }, []);
  
  // Filter players when search term or position changes
  useEffect(() => {
    let filtered = players;
    
    // Filter by position
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter(player => player.position === positionFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(term) || 
        player.team.toLowerCase().includes(term)
      );
    }
    
    setFilteredPlayers(filtered);
  }, [searchTerm, positionFilter, players]);
  
  // Auto-pick logic for AI teams
  useEffect(() => {
    if (!isUserTurn && players.length > 0) {
      // Clear any existing timers
      if (autoPickTimer) clearTimeout(autoPickTimer);
      
      // Set new timer for AI pick
      const timer = setTimeout(() => {
        const validPlayers = getValidPlayersForCurrentRound();
        if (validPlayers.length > 0) {
          // AI picks the best available player (highest rank_overall)
          const aiPick = validPlayers.sort((a, b) => a.rank_overall - b.rank_overall)[0];
          handlePickPlayer(aiPick);
        }
      }, 2000);
      
      setAutoPickTimer(timer);
    }
    
    return () => {
      if (autoPickTimer) clearTimeout(autoPickTimer);
    };
  }, [currentTeam, isUserTurn, players]);
  
  // Handle player selection
  const handlePlayerClick = (player) => {
    if (isUserTurn) {
      setSelectedPlayer(player);
    }
  };
  
  // Submit the selected player
  const handlePickPlayer = (player) => {
    // Remove the player from available players
    const updatedPlayers = players.filter(p => p.id !== player.id);
    setPlayers(updatedPlayers);
    
    // Reset selection
    setSelectedPlayer(null);
    
    // Pass the selected player up to the parent component
    onSelectPlayer(player);
  };
  
  // Get valid players for the current round based on draft rules
  const getValidPlayersForCurrentRound = () => {
    // Logic to determine which positions can be drafted in the current round
    // For example, don't allow DEF or K until later rounds
    const totalRounds = Object.values(draftSettings.lineup).reduce((a, b) => a + b, 0);
    const startingPositions = totalRounds - draftSettings.lineup.bench;
    
    // Don't draft DEF or K until the last few rounds (starting positions)
    if (currentRound <= totalRounds - startingPositions + 2) {
      return players.filter(player => player.position !== 'DEF' && player.position !== 'K');
    }
    
    return players;
  };
  
  // Check if a player can be drafted in the current round
  const isPlayerValidForCurrentRound = (player) => {
    const validPlayers = getValidPlayersForCurrentRound();
    return validPlayers.some(p => p.id === player.id);
  };
  
  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Player Selection
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {isUserTurn ? (
              <Alert severity="success" sx={{ mb: 1 }}>
                Your turn to pick! Round {currentRound}, Pick {currentTeam}
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mb: 1 }}>
                Team {currentTeam} is picking... Round {currentRound}
              </Alert>
            )}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={positionFilter}
            onChange={(e, newValue) => setPositionFilter(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {positions.map(pos => (
              <Tab key={pos} label={pos} value={pos} />
            ))}
          </Tabs>
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Paper sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => {
                  const isValid = isPlayerValidForCurrentRound(player);
                  return (
                    <React.Fragment key={player.id}>
                      {index > 0 && <Divider />}
                      <ListItem 
                        button 
                        onClick={() => handlePlayerClick(player)}
                        selected={selectedPlayer?.id === player.id}
                        disabled={!isUserTurn || !isValid}
                        sx={{
                          opacity: isValid ? 1 : 0.5,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {player.name}
                              </Typography>
                              <Chip 
                                label={`${player.position} ${player.rank_position}`} 
                                size="small" 
                                color={player.position === 'QB' ? 'primary' : 
                                       player.position === 'RB' ? 'secondary' : 
                                       player.position === 'WR' ? 'success' : 
                                       player.position === 'TE' ? 'info' : 
                                       player.position === 'DEF' ? 'warning' : 'error'}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {player.team} | Overall Rank: {player.rank_overall}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Proj: {player.projected_points} pts
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No players found" 
                    secondary="Try changing your search or position filter"
                  />
                </ListItem>
              )}
            </List>
          )}
        </Paper>
        
        {selectedPlayer && isUserTurn && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => handlePickPlayer(selectedPlayer)}
              fullWidth
            >
              Draft {selectedPlayer.name} ({selectedPlayer.position})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerSelection;
