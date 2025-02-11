import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io, Socket } from "socket.io-client";

const codeBlocks = [
  { id: "1", name: "Async Case" },
  { id: "2", name: "Promises" },
  { id: "3", name: "Loops" },
  { id: "4", name: "Functions" },
];

const CodeBlockPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<"mentor" | "student">("student");
  const [code, setCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const codeBlock = codeBlocks.find((block) => block.id === id);

  useEffect(() => {
    const socket: Socket = io("http://localhost:4000", { transports: ["websocket"] });
  
    socket.on("connect", () => {
      console.log(`🔗 Connected with ID: ${socket.id}`);
      socket.emit("joinRoom", { roomId: id });
    });
  
    const handleAssignRole = (assignedRole: "mentor" | "student") => setRole(assignedRole);
    const handleStudentCount = (count: number) => setStudentCount(count);
    const handleCodeUpdate = (newCode: string) => setCode(newCode); // ✅ Listen for code updates
    const handleRedirect = () => navigate("/");
  
    socket.on("assignRole", handleAssignRole);
    socket.on("studentCount", handleStudentCount);
    socket.on("codeUpdate", handleCodeUpdate); // ✅ Attach the listener
    socket.on("redirectToLobby", handleRedirect);
  
    return () => {
      console.log(`❌ Disconnecting socket: ${socket.id}`);
      socket.disconnect();
      socket.off("assignRole", handleAssignRole);
      socket.off("studentCount", handleStudentCount);
      socket.off("codeUpdate", handleCodeUpdate); // ✅ Remove listener
      socket.off("redirectToLobby", handleRedirect);
    };
  }, [id, navigate]);
  

  const handleCodeChange = (value: string) => {
    if (role === "student") {
      setCode(value);
      const socket = io("http://localhost:4000", { transports: ["websocket"] });
      socket.emit("codeChange", { roomId: id, code: value });
    }
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        {codeBlock ? codeBlock.name : "Code Block"}
      </Typography>

      <Typography variant="h6" color={role === "mentor" ? "#6E6658" : "#88BDBC"}>
        Role: {role === "mentor" ? "Mentor 👨‍🏫" : "Student 👩‍🎓"}
      </Typography>

      <Typography variant="h6" color="#88BDBC">
        Students in Room: {studentCount}
      </Typography>

      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          border: "2px solid #88BDBC",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <CodeMirror
          value={code}
          height="300px"
          extensions={[javascript()]}
          onChange={handleCodeChange}
          readOnly={role === "mentor"}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleLeave}
        sx={{
          backgroundColor: "#112D32",
          color: "#FFFFFF",
          marginTop: "20px",
          "&:hover": {
            backgroundColor: "#4F4A41",
          },
        }}
      >
        Leave Code Block
      </Button>
    </Box>
  );
};

export default CodeBlockPage;
