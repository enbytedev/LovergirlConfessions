import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './App.css';

const API_URL = 'http://localhost:8080/confessions';

function App() {
  const [confessions, setConfessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ recipient: '', message: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [countdownOver, setCountdownOver] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const releaseDate = new Date("2024-10-10T21:00:00");
      const now = new Date();
      const difference = releaseDate - now;

      if (difference > 0) {
        const timeLeft = {
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
        };
        setTimeLeft(timeLeft);
      } else {
        setCountdownOver(true); // Countdown is over, show streaming link
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchConfessions(page);
  }, [page]);

  const fetchConfessions = (pageNumber = 0) => {
    fetch(`${API_URL}/${pageNumber}`)
      .then((response) => response.json())
      .then((data) => {
        setConfessions(data);
        setHasNextPage(data.length === 24);
      })
      .catch((error) => {
        console.error('Error fetching confessions:', error);
        setSnackbar({ open: true, message: 'Error fetching confessions', severity: 'error' });
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.message.length > 150) {
      setSnackbar({ open: true, message: 'Message exceeds 150 characters.', severity: 'error' });
      return;
    }

    if (formData.recipient.length > 20) {
      setSnackbar({ open: true, message: 'Recipient exceeds 20 characters.', severity: 'error' });
      return;
    }

    fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          setSnackbar({ open: true, message: 'Confession added successfully!', severity: 'success' });
          fetchConfessions(0);
          setOpen(false);
          setThankYouDialogOpen(true);
        } else {
          throw new Error('Failed to add confession');
        }
      })
      .catch((error) => {
        setSnackbar({ open: true, message: 'Error submitting confession', severity: 'error' });
        console.error('Error submitting confession:', error);
      });
  };

  const handleThankYouClose = () => {
    setThankYouDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(Math.max(page - 1, 0));

  return (
    <div className="App">
      <header className="App-header">
        {!countdownOver ? (
          <div className="countdown-timer">
            <ul>
              <li><span>{timeLeft.days || '00'}</span><p>Days</p></li>
              <li className="colon">:</li>
              <li><span>{timeLeft.hours || '00'}</span><p>Hours</p></li>
              <li className="colon">:</li>
              <li><span>{timeLeft.minutes || '00'}</span><p>Minutes</p></li>
              <li className="colon">:</li>
              <li><span>{timeLeft.seconds || '00'}</span><p>Seconds</p></li>
            </ul>
          </div>
        ) : null}

        <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="Logo" className="App-logo" />
        
        <div className="promo-text">
          <h2 className="promo-title">
            Inspired by Rachel Bochner's EP, <span className="highlight">Lovergirl</span>, 
            out everywhere October 11th. Confessions of a Lovergirl encourages you to say how 
            you <span className="italic">really</span> feel.
          </h2>
          
          <p className="promo-description">
            To support Rachel, you can <a href="https://h-r.fans/rachel-lovergirl" className="presave-link">
              {!countdownOver ? "presave the EP here" : "listen to the EP here"} 
            </a>.
          </p>
        </div>
        
        <Button className="confession-button" color="secondary" variant="contained" onClick={handleClickOpen}>
          Leave a Confession
        </Button>
      </header>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Leave a Confession 🎭</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f0f0f0' }}>
          <TextField
            color="secondary"
            autoFocus
            margin="dense"
            id="recipient"
            label="Recipient"
            name="recipient"
            fullWidth
            variant="outlined"
            value={formData.recipient}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            color="secondary"
            margin="dense"
            id="message"
            label={`Confession (${formData.message.length}/150)`}
            name="message"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.message}
            onChange={handleChange}
            inputProps={{ maxLength: 150 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={thankYouDialogOpen} onClose={handleThankYouClose}>
        <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Thank you for your confession ❤️</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f0f0f0' }}>
          <Typography>
            Continue your Lovergirl Era by streaming <a href="https://h-r.fans/rachel-lovergirl">here</a>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
          <Button onClick={handleThankYouClose} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="confession-list">
        {confessions.map((confession, index) => (
          <Paper
            elevation={3}
            className="confession-box"
            key={index}
            style={{ backgroundColor: '#f9f9f9' }}
          >
            <div className="confession-header">
              <Typography className="confession-recipient" align="left">
                To: {confession.recipient}
              </Typography>
              <Typography className="confession-timestamp" align="right">
                {new Date(confession.timestamp).toLocaleString()}
              </Typography>
            </div>
            <Divider variant="middle" className="divider" />
            <div className="confession-body">
              <Typography variant="body1" className="confession-message">
                {confession.message}
              </Typography>
            </div>
          </Paper>
        ))}
        <div className="pagination">
          <Button
            onClick={handlePrevPage}
            color="secondary"
            variant="text"
            disabled={page === 0}
            className={page === 0 ? "disabled-button" : ""}
          >
            Prev
          </Button>

          <span className="page-number">{page + 1}</span>

          <Button
            onClick={handleNextPage}
            color="secondary"
            variant="text"
            disabled={!hasNextPage}
            className={!hasNextPage ? "disabled-button" : ""}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
