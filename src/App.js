// src/App.js
import React from 'react';
import VideoCall from './components/VideoCall';
import { Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Aplicación de Videollamadas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <VideoCall />
      </Box>
    </Container>
  );
}

export default App;
