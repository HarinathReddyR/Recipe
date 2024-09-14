import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


interface PopupProps {
  title: string;
  openPopup: boolean;
  setOpenPopup: (open: boolean) => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, openPopup, setOpenPopup, children }) => {
  return (
    <Dialog open={openPopup} onClose={() => setOpenPopup(false)} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenPopup(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
