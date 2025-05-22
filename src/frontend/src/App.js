import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DraftSetup from './components/DraftSetup';
import DraftBoard from './components/DraftBoard';
import PlayerSelection from './components/PlayerSelection';
import Header from './components/Header';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  // Application state
  const [draftStarted, setDraftStarted] = useState(false);
  const [draftSettings, setDraftSettings] = useState({
    draftType: 'snake',
    numTeams: 10,
    draftPosition: 1,
    isRandomPosition: false,
    lineup: {
      qb: 1,
      rb: 2,
      wr: 2,
      te: 1,
      flex: 1,
      def: 1,
      k: 1,
      bench: 6
    }
  });
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPick, setCurrentPick] = useState(1);
  const [userTeam, setUserTeam] = useState([]);
  
  // Calculate total rounds
  const totalRounds = draftSettings.lineup.qb + 
                      draftSettings.lineup.rb + 
                      draftSettings.lineup.wr + 
                      draftSettings.lineup.te + 
                      draftSettings.lineup.flex + 
                      draftSettings.lineup.def + 
                      draftSettings.lineup.k + 
                      draftSettings.lineup.bench;

  // Handler for starting the draft
  const handleStartDraft = (settings) => {
    setDraftSettings(settings);
    setDraftStarted(true);
    
    // Initialize draft board with empty picks
    const newDraftBoard = [];
    for (let round = 1; round <= totalRounds; round++) {
      const roundPicks = [];
      for (let team = 1; team <= settings.numTeams; team++) {
        // For snake draft, reverse order on even rounds
        const actualTeam = settings.draftType === 'snake' && round % 2 === 0
          ? settings.numTeams - team + 1
          : team;
          
        roundPicks.push({
          round,
          pickNumber: (round - 1) * settings.numTeams + team,
          team: actualTeam,
          player: null
        });
      }
      newDraftBoard.push(roundPicks);
    }
    
    setDraftBoard(newDraftBoard);
    setUserTeam([]);
  };

  // Handler for player selection
  const handleSelectPlayer = (player) => {
    // Update draft board
    const newDraftBoard = [...draftBoard];
    const currentPickIndex = currentPick - 1;
    const currentRoundIndex = currentRound - 1;
    
    // Find the current pick in the draft board
    if (newDraftBoard[currentRoundIndex] && newDraftBoard[currentRoundIndex][currentPickIndex % draftSettings.numTeams]) {
      newDraftBoard[currentRoundIndex][currentPickIndex % draftSettings.numTeams].player = player;
    }
    
    setDraftBoard(newDraftBoard);
    
    // Update user team if it's the user's pick
    if (currentTeam === draftSettings.draftPosition) {
      setUserTeam([...userTeam, player]);
    }
    
    // Move to next pick
    const nextPick = currentPick + 1;
    const nextRound = Math.ceil(nextPick / draftSettings.numTeams);
    
    // Calculate next team based on draft type
    let nextTeam;
    if (draftSettings.draftType === 'snake') {
      if (nextRound % 2 === 1) {
        // Odd rounds go 1 to N
        nextTeam = ((nextPick - 1) % draftSettings.numTeams) + 1;
      } else {
        // Even rounds go N to 1
        nextTeam = draftSettings.numTeams - ((nextPick - 1) % draftSettings.numTeams);
      }
    } else {
      // Standard draft always goes 1 to N
      nextTeam = ((nextPick - 1) % draftSettings.numTeams) + 1;
    }
    
    setCurrentPick(nextPick);
    setCurrentRound(nextRound);
    setCurrentTeam(nextTeam);
    
    // If it's not the user's turn, simulate AI pick
    if (nextTeam !== draftSettings.draftPosition && nextPick <= totalRounds * draftSettings.numTeams) {
      setTimeout(() => {
        // AI will make a pick after a short delay
        // Logic to be implemented in PlayerSelection component
      }, 1000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
          {!draftStarted ? (
            <DraftSetup onStartDraft={handleStartDraft} />
          ) : (
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <PlayerSelection 
                  onSelectPlayer={handleSelectPlayer} 
                  currentTeam={currentTeam}
                  userTeamNumber={draftSettings.draftPosition}
                  currentRound={currentRound}
                  draftSettings={draftSettings}
                  userTeam={userTeam}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <DraftBoard 
                  draftBoard={draftBoard} 
                  currentPick={currentPick}
                  userTeamNumber={draftSettings.draftPosition}
                  draftSettings={draftSettings}
                />
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
