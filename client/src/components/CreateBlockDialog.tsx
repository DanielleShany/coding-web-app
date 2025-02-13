import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { createCodeBlock } from "../services/socketService";

// Props Interface
interface CreateBlockDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateBlockDialog: React.FC<CreateBlockDialogProps> = ({ open, onClose }) => {
  const [newBlockName, setNewBlockName] = useState("");

  /*Handle block creation */
  const handleCreateBlock = () => {
    if (newBlockName.trim()) {
      createCodeBlock(newBlockName);
      setNewBlockName("");
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
        <Button onClick={handleCreateBlock} disabled={!newBlockName.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBlockDialog;
