import React from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const codeBlocks = [
  { id: 1, name: 'Async Case' },
  { id: 2, name: 'Promises' },
  { id: 3, name: 'Loops' },
  { id: 4, name: 'Functions' },
];

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh"> {/* Teal Background */}
      <Typography variant="h4" gutterBottom color="#88BDBC">           {/* Mint Green Title */}
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
                backgroundColor: '#112D32',   // Dark Green Button
                color: '#FFFFFF',             // White Text
                padding: '20px',
                height: '100px',
                fontSize: '18px',
                borderRadius: '12px',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#4F4A41', // Brown Hover Effect
                  transform: 'scale(1.05)',
                },
              }}
            >
              {block.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Lobby;
