import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to the server

const CodeBlockPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<'mentor' | 'student'>('student');
  const [code, setCode] = useState('// Start coding here...');

  useEffect(() => {
    const isMentor = !sessionStorage.getItem('mentorAssigned');
    if (isMentor) {
      setRole('mentor');
      sessionStorage.setItem('mentorAssigned', 'true');
    }

    socket.emit('joinRoom', { roomId: id });

    // Receive initial code when joining the room
    socket.on('loadCode', (initialCode) => {
      setCode(initialCode);
    });

    // Listen for code updates from other users
    socket.on('codeUpdate', (newCode) => {
      if (role === 'mentor') {
        setCode(newCode); // Mentor sees real-time updates
      }
    });

    // Redirect to lobby if mentor leaves
    socket.on('redirectToLobby', () => {
      sessionStorage.removeItem('mentorAssigned');
      navigate('/');
    });

    return () => {
      socket.off('codeUpdate');
      socket.off('redirectToLobby');
    };
  }, [id, navigate, role]);

  const handleCodeChange = (value: string) => {
    if (role === 'student') {
      setCode(value);
      socket.emit('codeChange', { roomId: id, code: value });
    }
  };

  const handleLeave = () => {
    if (role === 'mentor') {
      socket.emit('mentorLeft', id);
    }
    navigate('/');
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#d9d9d9" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#732673">
        Code Block {id}
      </Typography>

      <Typography variant="h6" color={role === 'mentor' ? '#732673' : '#404040'}>
        Role: {role === 'mentor' ? 'Mentor 👨‍🏫' : 'Student 👩‍🎓'}
      </Typography>

      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #404040',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <CodeMirror
          value={code}
          height="300px"
          extensions={[javascript()]}
          onChange={handleCodeChange}
          readOnly={role === 'mentor'}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleLeave}
        sx={{
          backgroundColor: '#732673',
          color: '#ffffff',
          marginTop: '20px',
          '&:hover': {
            backgroundColor: '#404040',
          },
        }}
      >
        Leave Code Block
      </Button>
    </Box>
  );
};

export default CodeBlockPage;
