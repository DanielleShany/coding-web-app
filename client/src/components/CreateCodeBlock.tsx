// client/src/components/CreateCodeBlockDialog.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface CreateCodeBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateCodeBlock: React.FC<CreateCodeBlockDialogProps> = ({ open, onClose, onCreate }) => {
  const [newBlockName, setNewBlockName] = useState('');

  const handleCreate = () => {
    if (newBlockName.trim()) {
      onCreate(newBlockName);
      setNewBlockName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Code Block</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Code Block Name"
          fullWidth
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!newBlockName.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCodeBlock;
