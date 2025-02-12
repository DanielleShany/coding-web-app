import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { io } from "socket.io-client";

const socket = io("https://coding-web-app-yx33.onrender.com");
interface CodeBlock {
  _id: string;
  name: string;
  code?: string;    
  solution?: string;  
}


const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]); 

  const [open, setOpen] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("getCodeBlocks"); 

    socket.on("codeBlocks", (blocks: CodeBlock[]) => {
      console.log("✅ Received code blocks from server:", blocks);  // ✅ Debug log
      setCodeBlocks(blocks);
    });
    

    socket.on("newCodeBlock", (newBlock) => {
      console.log("🆕 New Block Received:", newBlock); 
      setCodeBlocks((prev: CodeBlock[]) => [...prev, newBlock]);

    });

    return () => {
      socket.off("codeBlocks");
      socket.off("newCodeBlock");
    };
  }, []);

  const handleCreateBlock = () => {
    if (newBlockName.trim()) {
      socket.emit("createCodeBlock", { name: newBlockName });
      setNewBlockName("");
      setOpen(false);
    }
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        Choose Code Block
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {codeBlocks.map((block) => (
          <Grid item xs={6} sm={3} key={block._id}> {/* ✅ Use _id here */}
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/codeblock/${block._id}`)} // ✅ Navigate with MongoDB _id
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
