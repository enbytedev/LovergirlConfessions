import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ConfessionCard = ({ confession, showShareButton = true }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/${confession.confessionId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSnackbar({ open: true, message: 'Confession link copied to clipboard!', severity: 'success' });
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Paper
      elevation={3}
      className="confession-box"
      sx={{
        padding: '20px',
        margin: '20px auto',
        maxWidth: '600px',
        width: '300px',
        backgroundImage: `url(${process.env.PUBLIC_URL}/paper.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        minHeight: '200px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        borderRadius: '0px',
      }}
    >
      <div className="confession-header">
        <Typography className="confession-recipient" align="left" variant="h6">
          To: {confession.recipient}
        </Typography>
        <Typography className="confession-timestamp" align="right" variant="h6">
          {new Date(confession.timestamp).toLocaleDateString()}
        </Typography>
      </div>
      <Divider variant="middle" className="divider" />
      <div className="confession-body">
        <Typography variant="h6" className="confession-message">
          {confession.message}
        </Typography>
      </div>

      {showShareButton && (
        <IconButton
          onClick={handleShareClick}
          color="primary"
          sx={{ position: 'absolute', bottom: '30px', right: '0px' }}
        >
          <ShareIcon />
        </IconButton>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ConfessionCard;
