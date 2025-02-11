// client/src/pages/CodeBlockPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import socket from '../socket';

const codeBlocks = [
  { id: '1', name: 'Async Case' },
  { id: '2', name: 'Promises' },
  { id: '3', name: 'Loops' },
  { id: '4', name: 'Functions' },
];

const CodeBlockPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<'mentor' | 'student'>('student');
  const [code, setCode] = useState('// Start coding here...');

  const codeBlock = codeBlocks.find((block) => block.id === id);

  useEffect(() => {
    socket.emit('joinRoom', { roomId: id });

    socket.on('assignRole', (assignedRole: 'mentor' | 'student') => {
      setRole(assignedRole);
    });

    socket.on('redirectToLobby', () => {
      console.log('Mentor left, redirecting to the Lobby');
      navigate('/');
    });

    socket.on('codeUpdate', (newCode: string) => {
      if (role === 'mentor') {
        setCode(newCode);
      }
    });

    return () => {
      socket.off('assignRole');
      socket.off('redirectToLobby');
      socket.off('codeUpdate');
    };
  }, [id, navigate, role]);

  const handleCodeChange = (value: string) => {
    if (role === 'student') {
      setCode(value);
      socket.emit('codeChange', { roomId: id, code: value });
    }
  };

  const handleLeave = () => {
    socket.disconnect();
    navigate('/');
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        {codeBlock ? codeBlock.name : 'Code Block'}
      </Typography>

      <Typography variant="h6" color={role === 'mentor' ? '#6E6658' : '#88BDBC'}>
        Role: {role === 'mentor' ? 'Mentor 👨‍🏫' : 'Student 👩‍🎓'}
      </Typography>

      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #88BDBC',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px',
          textAlign: 'left', // Align code to the left
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
          backgroundColor: '#112D32',
          color: '#FFFFFF',
          marginTop: '20px',
          '&:hover': {
            backgroundColor: '#4F4A41',
          },
        }}
      >
        Leave Code Block
      </Button>
    </Box>
  );
};

export default CodeBlockPage;
