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
  const [page, setPage] = useState(0); // Track the current page
  const [hasNextPage, setHasNextPage] = useState(true); // Track if there are more confessions

  useEffect(() => {
    fetchConfessions(page); // Fetch confessions for the current page
  }, [page]);

  // Fetch confessions with pagination
  const fetchConfessions = (pageNumber = 0) => {
    fetch(`${API_URL}/${pageNumber}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Confessions fetched:', data); // For debugging
        setConfessions(data);
        setHasNextPage(data.length === 25); // If fewer than 25 confessions are returned, no next page
      })
      .catch((error) => {
        console.error('Error fetching confessions:', error);
        setSnackbar({ open: true, message: 'Error fetching confessions', severity: 'error' });
      });
  };

  // Open the dialog for submitting confessions
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (formData.message.length > 150) {
      setSnackbar({ open: true, message: 'Message exceeds 150 characters.', severity: 'error' });
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
          fetchConfessions(0); // Reload the first page of confessions
          setOpen(false); // Close the form dialog
        } else {
          throw new Error('Failed to add confession');
        }
      })
      .catch((error) => {
        setSnackbar({ open: true, message: 'Error submitting confession', severity: 'error' });
        console.error('Error submitting confession:', error);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  // Handle pagination
  const handleNextPage = () => setPage(page + 1); // Go to the next page
  const handlePrevPage = () => setPage(Math.max(page - 1, 0)); // Prevent going below page 0

  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="Logo" className="App-logo" />
        <h2>placeholder promo text</h2>
        <Button color="secondary" variant="contained" onClick={handleClickOpen}>
          Leave a Confession
        </Button>
      </header>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: '#f0f0f0' }}>Leave a Confession</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f0f0f0' }}> {/* Light gray background */}
          <TextField
            autoFocus
            margin="dense"
            id="recipient"
            label="Recipient"
            name="recipient"
            fullWidth
            variant="outlined"
            value={formData.recipient}
            onChange={handleChange}
          />
          <TextField
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
            inputProps={{ maxLength: 150 }} // Limit input to 150 characters
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            Submit
          </Button>
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
            <Divider variant="middle" className="divider"/>
            <div className="confession-body">
              <Typography variant="body1" className="confession-message">
                {confession.message}
              </Typography>
            </div>
          </Paper>
        ))}
        {/* Pagination Buttons */}
        <div className="pagination">
          {page > 0 && (
            <Button
              onClick={handlePrevPage}
              color = 'secondary'
              variant = ''
            >
              Previous
            </Button>
          )}
          {hasNextPage && (
            <Button
              onClick={handleNextPage}
              color = 'secondary'
              variant = ''
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
