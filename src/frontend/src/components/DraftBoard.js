import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
  Grid
} from '@mui/material';

// Component to display a player card for a draft pick
const PlayerCard = ({ player, isCurrentPick }) => {
  if (!player) {
    return (
      <Box 
        sx={{ 
          height: 80, 
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: isCurrentPick ? '2px solid' : '1px solid',
          borderColor: isCurrentPick ? 'primary.main' : 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1,
          boxShadow: isCurrentPick ? 3 : 0,
          className: isCurrentPick ? 'current-pick' : ''
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {isCurrentPick ? 'Current Pick' : 'Not Selected'}
        </Typography>
      </Box>
    );
  }

  // Color mappings for different positions
  const positionColors = {
    QB: 'primary.main',
    RB: 'secondary.main',
    WR: 'success.main',
    TE: 'info.main',
    DEF: 'warning.main',
    K: 'error.main'
  };

  return (
    <Box 
      sx={{
        height: 80,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: positionColors[player.position] || 'divider',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 2
        },
        boxShadow: 1,
        className: 'player-card'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '0.9rem' }} noWrap>
          {player.name}
        </Typography>
        <Chip 
          label={player.position}
          size="small"
          sx={{ 
            bgcolor: positionColors[player.position],
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            height: 20,
            minWidth: 30
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {player.team}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          #{player.rank_overall} Ovr / #{player.rank_position} {player.position}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
          {player.projected_points.toFixed(1)} pts
        </Typography>
      </Box>
    </Box>
  );
};

const DraftBoard = ({ draftBoard, currentPick, userTeamNumber, draftSettings }) => {
  // Check if draft board is still being initialized
  if (!draftBoard || draftBoard.length === 0) {
    return (
      <Card elevation={3} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Draft Board
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography>Initializing draft board...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Helper to determine if a pick is the current pick
  const isCurrentPick = (round, pick) => {
    const totalPicksPerRound = draftSettings.numTeams;
    const absolutePickNumber = (round - 1) * totalPicksPerRound + pick;
    return absolutePickNumber === currentPick;
  };
  
  // Helper to determine team name
  const getTeamName = (teamNumber) => {
    if (teamNumber === userTeamNumber) {
      return 'Your Team';
    }
    return `Team ${teamNumber}`;
  };

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Draft Board
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {draftSettings.draftType === 'snake' ? 'Snake Draft' : 'Standard Draft'} | 
            {draftSettings.numTeams} Teams | Your Position: {userTeamNumber}
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
          {draftBoard.map((round, roundIndex) => (
            <Box key={`round-${roundIndex + 1}`} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Round {roundIndex + 1}
              </Typography>
              
              <Grid container spacing={1}>
                {round.map((pick, pickIndex) => (
                  <Grid 
                    item 
                    xs={6} 
                    sm={4} 
                    md={3} 
                    key={`pick-${roundIndex + 1}-${pickIndex + 1}`}
                    sx={{
                      '& > div': {
                        borderColor: pick.team === userTeamNumber ? 'primary.main' : 'inherit',
                        bgcolor: pick.team === userTeamNumber ? 'primary.lightest' : 'inherit'
                      }
                    }}
                  >
                    <Box sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: pick.team === userTeamNumber ? 'bold' : 'regular' }}>
                        {getTeamName(pick.team)}
                      </Typography>
                    </Box>
                    <PlayerCard 
                      player={pick.player} 
                      isCurrentPick={isCurrentPick(roundIndex + 1, pickIndex + 1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DraftBoard;
