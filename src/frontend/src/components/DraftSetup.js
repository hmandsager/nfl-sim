import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Button,
  Slider,
  Switch,
  Grid,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const DraftSetup = ({ onStartDraft }) => {
  // Default draft settings
  const [settings, setSettings] = useState({
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
  
  const [error, setError] = useState(null);

  // Calculate total roster size
  const totalRosterSize = Object.values(settings.lineup).reduce((a, b) => a + b, 0);

  // Handle changes to form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  // Handle changes to lineup settings
  const handleLineupChange = (position, value) => {
    setSettings({
      ...settings,
      lineup: {
        ...settings.lineup,
        [position]: value
      }
    });
  };

  // Handle toggle for random draft position
  const handleRandomToggle = (event) => {
    setSettings({
      ...settings,
      isRandomPosition: event.target.checked,
      draftPosition: event.target.checked ? Math.floor(Math.random() * settings.numTeams) + 1 : 1
    });
  };

  // Validate settings before starting draft
  const validateSettings = () => {
    // Validate number of teams
    if (settings.numTeams < 4 || settings.numTeams > 20) {
      setError('Number of teams must be between 4 and 20');
      return false;
    }
    
    // Validate draft position
    if (!settings.isRandomPosition && (settings.draftPosition < 1 || settings.draftPosition > settings.numTeams)) {
      setError(`Draft position must be between 1 and ${settings.numTeams}`);
      return false;
    }
    
    // Validate lineup has minimum players
    if (totalRosterSize < 10) {
      setError('Total roster size must be at least 10 players');
      return false;
    }
    
    setError(null);
    return true;
  };

  // Start the draft
  const handleStartDraft = () => {
    if (validateSettings()) {
      onStartDraft(settings);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Fantasy Draft Setup
      </Typography>
      
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Draft Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography gutterBottom>Draft Type</Typography>
                <RadioGroup
                  row
                  name="draftType"
                  value={settings.draftType}
                  onChange={handleChange}
                >
                  <FormControlLabel value="snake" control={<Radio />} label="Snake" />
                  <FormControlLabel value="standard" control={<Radio />} label="Standard" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography gutterBottom>Number of Teams</Typography>
                <Slider
                  name="numTeams"
                  value={settings.numTeams}
                  onChange={(e, val) => handleChange({ target: { name: 'numTeams', value: val } })}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={4}
                  max={20}
                />
                <Typography variant="body2" align="center">
                  {settings.numTeams} Teams
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Draft Position</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.isRandomPosition}
                      onChange={handleRandomToggle}
                    />
                  }
                  label="Random Position"
                />
              </Grid>
              <Grid item xs>
                {!settings.isRandomPosition && (
                  <TextField
                    name="draftPosition"
                    label="Your Draft Position"
                    type="number"
                    value={settings.draftPosition}
                    onChange={handleChange}
                    disabled={settings.isRandomPosition}
                    InputProps={{ inputProps: { min: 1, max: settings.numTeams } }}
                    fullWidth
                  />
                )}
                {settings.isRandomPosition && (
                  <Alert severity="info" sx={{ py: 0 }}>
                    Your position will be randomly assigned when the draft starts
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Lineup Settings
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">
            Configure your roster positions
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Quarterbacks (QB)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.qb}
                onChange={(e) => handleLineupChange('qb', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3].map((num) => (
                  <MenuItem key={`qb-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Running Backs (RB)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.rb}
                onChange={(e) => handleLineupChange('rb', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={`rb-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Wide Receivers (WR)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.wr}
                onChange={(e) => handleLineupChange('wr', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={`wr-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Tight Ends (TE)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.te}
                onChange={(e) => handleLineupChange('te', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3].map((num) => (
                  <MenuItem key={`te-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>FLEX (RB/WR/TE)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.flex}
                onChange={(e) => handleLineupChange('flex', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3].map((num) => (
                  <MenuItem key={`flex-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Defense (DEF)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.def}
                onChange={(e) => handleLineupChange('def', parseInt(e.target.value))}
              >
                {[0, 1, 2].map((num) => (
                  <MenuItem key={`def-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Kicker (K)</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.k}
                onChange={(e) => handleLineupChange('k', parseInt(e.target.value))}
              >
                {[0, 1, 2].map((num) => (
                  <MenuItem key={`k-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={6} sm={4} md={3}>
              <Typography gutterBottom>Bench Spots</Typography>
              <TextField
                select
                fullWidth
                value={settings.lineup.bench}
                onChange={(e) => handleLineupChange('bench', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <MenuItem key={`bench-${num}`} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">
              Total roster size: <strong>{totalRosterSize} players</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              ({totalRosterSize} rounds in the draft)
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={handleStartDraft}
          sx={{ px: 4, py: 1.5 }}
        >
          Start Draft
        </Button>
      </Box>
    </Box>
  );
};

export default DraftSetup;
