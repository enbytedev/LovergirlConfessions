// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import IndividualConfession from './IndividualConfession';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#8D314C' },
    secondary: { main: '#350066' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:confessionId" element={<IndividualConfession />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
