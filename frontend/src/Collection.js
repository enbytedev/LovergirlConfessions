import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import ConfessionCard from './ConfessionCard';
import { Button } from '@mui/material';

const API_URL = 'https://api.lovergirlconfessions.com/confessions';
// const API_URL = 'http://localhost:8080/confessions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8D314C',
    },
    secondary: {
      main: '#350066',
    },
  },
});

function Collection() {
  const [confessions, setConfessions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    fetchConfessions(page);
  }, [page]);

  const fetchConfessions = (pageNumber = 0) => {
    fetch(`${API_URL}/${pageNumber}`)
      .then((response) => response.json())
      .then((data) => {
        // Concatenate new confessions with existing ones
        setConfessions((prevConfessions) => [...prevConfessions, ...data]);
        setHasNextPage(data.length === 24); // Check if there are more confessions to load
      })
      .catch((error) => {
        console.error('Error fetching confessions:', error);
      });
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="confession-list-collection">
        {confessions.map((confession, index) => (
          <ConfessionCard key={index} confession={confession} showShareButton={false} />
        ))}

        <div className="pagination">
          <Button
            onClick={handleNextPage}
            color="secondary"
            variant="text"
            disabled={!hasNextPage}
            className={!hasNextPage ? "disabled-button" : ""}
          >
            {hasNextPage ? 'Load More Confessions' : 'No More Confessions'}
          </Button>
        </div>
      </div>
      {/* Spacer div for additional space */}
      <div style={{ height: '30px' }}></div>
    </ThemeProvider>
  );
}

export default Collection;
