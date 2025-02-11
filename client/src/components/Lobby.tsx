import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000", { transports: ["websocket"] });

const Lobby = () => {
  const navigate = useNavigate();
  const [codeBlocks, setCodeBlocks] = useState([
    { id: "1", name: "Async Case" },
    { id: "2", name: "Promises" },
    { id: "3", name: "Loops" },
    { id: "4", name: "Functions" },
  ]);
  const [open, setOpen] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");

  useEffect(() => {
    socket.on("newCodeBlock", (newBlock) => {
      setCodeBlocks((prev) => [...prev, newBlock]); // ✅ Add new blocks in real-time
    });

    return () => {
      socket.off("newCodeBlock");
    };
  }, []);

  const handleCreateBlock = () => {
    socket.emit("createCodeBlock", { name: newBlockName }); // ✅ Send create event to server
    setNewBlockName("");
    setOpen(false);
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        Choose Code Block
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {codeBlocks.map((block) => (
          <Grid item xs={6} sm={3} key={block.id}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/codeblock/${block.id}`)}
              sx={{
                backgroundColor: "#112D32",
                color: "#FFFFFF",
                padding: "20px",
                height: "100px",
                fontSize: "18px",
                borderRadius: "12px",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#4F4A41",
                  transform: "scale(1.05)",
                },
              }}
            >
              {block.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          marginTop: "20px",
          borderColor: "#88BDBC",
          color: "#88BDBC",
          "&:hover": {
            backgroundColor: "#4F4A41",
            color: "#FFFFFF",
          },
        }}
      >
        Create New Code Block
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBlock} disabled={!newBlockName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lobby;
