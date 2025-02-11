import React, { useState } from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateCodeBlockDialog from './CreateCodeBlock';

const initialCodeBlocks = [
  { id: 1, name: 'Async Case' },
  { id: 2, name: 'Promises' },
  { id: 3, name: 'Loops' },
  { id: 4, name: 'Functions' },
];

const Lobby = () => {
  const navigate = useNavigate();
  const [codeBlocks, setCodeBlocks] = useState(initialCodeBlocks);
  const [open, setOpen] = useState(false);

  const handleCreateBlock = (name: string) => {
    const newBlock = {
      id: codeBlocks.length + 1,
      name,
    };
    setCodeBlocks([...codeBlocks, newBlock]);
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
                backgroundColor: '#112D32',
                color: '#FFFFFF',
                padding: '20px',
                height: '100px',
                fontSize: '18px',
                borderRadius: '12px',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#4F4A41',
                  transform: 'scale(1.05)',
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
          marginTop: '20px',
          borderColor: '#88BDBC',
          color: '#88BDBC',
          '&:hover': {
            backgroundColor: '#4F4A41',
            color: '#FFFFFF',
          },
        }}
      >
        Create New Code Block
      </Button>

      <CreateCodeBlockDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreateBlock}
      />
    </Box>
  );
};

export default Lobby;
