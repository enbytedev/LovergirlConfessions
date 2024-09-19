// src/IndividualConfession.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ConfessionCard from './ConfessionCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

// const API_URL = 'https://api.lovergirlconfessions.com/confessions';
const API_URL = 'http://localhost:8080/id';

function IndividualConfession() {
  const { confessionId } = useParams();
  const [confession, setConfession] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  useEffect(() => {
    fetch(`${API_URL}/${confessionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Confession not found');
        }
        return response.json();
      })
      .then((data) => setConfession(data))
      .catch((err) => setError(err.message));
  }, [confessionId]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!confession) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="App">
    <header className="App-header">
      <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="Logo" className="App-logo" />
      
      <div className="promo-text">
      </div>
      
      <Button className="confession-button" color="primary" variant="contained" onClick={handleGoHome}>
        Go Home
      </Button>
    </header>
    <h3>Confession #{confessionId}</h3>
    <ConfessionCard confession={confession} showShareButton={false} />
    <h3>#<span className="highlight">Lovergirl</span>Confessions</h3>
    {/* Footer */}
    <footer className="App-footer">
      <small>
          By using this service, you agree that the content you submit complies with our terms and conditions. We are not liable for any user-generated content. If you believe any submission is in breach of the terms outlined prior to submission, contains inappropriate material, or violates any rights, please contact us at <a href="mailto:rachelbochnermusic@gmail.com">rachelbochnermusic@gmail.com</a> for prompt review and action.
          <br></br>
          Source on <a href="https://github.com/enbytedev/LovergirlConfessions">GitHub</a> | Made with ❤️ by <a href="https://github.com/enbytedev">enbytedev</a>
      </small>
    </footer>
  </div>
  );
}

export default IndividualConfession;
