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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import ConfessionCard from './ConfessionCard';

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

function MainPage() {
  const [confessions, setConfessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ recipient: '', message: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [countdownOver, setCountdownOver] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } else {
        setCountdownOver(true);
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
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          {!countdownOver && !loading ? (
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
              Inspired by Rachel Bochner's EP, <span className="highlight">Lovergirl</span>, out everywhere October 11th.
              Confessions of a Lovergirl encourages you to admit how you really feel about your <span className="italic">crush</span>, your <span className="italic">situationship</span>, the <span className="italic">love of your life</span>, or the <span className="italic">one that got away</span>. 
            </h2>
            
            <p className="promo-description">
              TO SUPPORT RACHEL, YOU CAN <a href="https://h-r.fans/rachel-lovergirl" className="presave-link">
                {!countdownOver ? "PRESAVE THE EP HERE" : "LISTEN TO THE EP HERE"} 
              </a>.
            </p>
          </div>
          
          <Button className="confession-button" color="primary" variant="contained" onClick={handleClickOpen}>
            Post a Confession
          </Button>
        </header>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Post a Confession 🎭</DialogTitle>
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
            <small>By submitting your confession, you confirm that you are at least 18 years of age and have all necessary rights, licenses, consents, and permissions to post the content. You agree that your submission does not contain any personally identifiable information (such as full names, usernames, addresses, phone numbers, or places of employment) or violate any third-party rights, including intellectual property or privacy rights. Additionally, you affirm that the content is not harmful, offensive, inappropriate, mean-spirited, or in violation of any applicable laws or regulations.</small>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={thankYouDialogOpen} onClose={handleThankYouClose}>
          <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Welcome to Lovergirl World ❤️</DialogTitle>
          <DialogContent sx={{ backgroundColor: '#f0f0f0' }}>
            <Typography>
              Stream our anthems {!countdownOver ? <a href="https://open.spotify.com/playlist/2G7w8tr36x9pGEfquEey5P?si=c7c4eb4204d84f53&nd=1&dlsi=f7e9a901ca664afd">here</a> : <a href="https://h-r.fans/rachel-lovergirl">here</a>}.
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
            <ConfessionCard key={index} confession={confession} showLink />
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

        {/* Footer */}
        <footer className="App-footer">
        <small>
            By using this service, you agree that the content you submit complies with our terms and conditions. We are not liable for any user-generated content. If you believe any submission is in breach of the terms outlined prior to submission, contains inappropriate material, or violates any rights, please contact us at <a href="mailto:rachelbochnermusic@gmail.com">rachelbochnermusic@gmail.com</a> for prompt review and action.
            <br></br>
            Source on <a href="https://github.com/enbytedev/LovergirlConfessions">GitHub</a> | Made with ❤️ by <a href="https://github.com/enbytedev">enbytedev</a>
        </small>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default MainPage;
