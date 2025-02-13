import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import CodeBlockItem from "./CodeBlockItem";
import CreateBlockDialog from "./CreateBlockDialog";
import { fetchCodeBlocks, listenForNewBlocks, removeSocketListeners } from "../services/socketService";

// Define TypeScript Interface for Code Blocks
interface CodeBlock {
  _id: string;
  name: string;
  code?: string;
  solution?: string;
}

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [open, setOpen] = useState(false); // Dialog state

  /*Fetch data from the server when component mounts */
  useEffect(() => {
    fetchCodeBlocks(setCodeBlocks);
    listenForNewBlocks((newBlock) => setCodeBlocks((prev) => [...prev, newBlock]));

    return () => {
      removeSocketListeners();
    };
  }, []);

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        Choose Code Block
      </Typography>

      {/* Display Code Blocks */}
      <Grid container spacing={2} justifyContent="center">
        {codeBlocks.map((block) => (
          <CodeBlockItem key={block._id} id={block._id} name={block.name} />
        ))}
      </Grid>

      {/* Create New Code Block Button */}
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

      {/* Create Block Dialog */}
      <CreateBlockDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Lobby;
