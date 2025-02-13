import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io, Socket } from "socket.io-client";

// ✅ TypeScript interface for CodeBlock
interface CodeBlock {
  _id: string;
  name: string;
  code: string;
}

const CodeBlockPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<"mentor" | "student">("student");
  const [code, setCode] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [codeBlock, setCodeBlock] = useState<CodeBlock | null>(null); 
  const [showSmiley, setShowSmiley] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io("https://coding-web-app-yx33.onrender.com", { transports: ["websocket"] });
    setSocket(newSocket);
  
    newSocket.on("connect", () => {
      console.log(`🔗 Connected with ID: ${newSocket.id}`);
      newSocket.emit("joinRoom", { roomId: id }); 
    });
  
    newSocket.on("assignRole", (assignedRole: "mentor" | "student") => setRole(assignedRole));
    newSocket.on("studentCount", (count: number) => setStudentCount(count));
  
    // ✅ Add this to fetch code block details
    newSocket.on("codeBlockData", (block: CodeBlock) => {
      console.log("📦 Received Code Block:", block);
      setCodeBlock(block);       
      setCode(block.code);     
    });
  
    newSocket.on("codeUpdate", (newCode: string) => {
      console.log("📝 Received code update:", newCode);
      setCode(newCode);
    });
  
    newSocket.on("redirectToLobby", () => navigate("/"));
    newSocket.on("showSmiley", () => setShowSmiley(true));
  
    return () => {
      newSocket.disconnect();
    };
  }, [id, navigate]);
  
  

  const handleCodeChange = (value: string) => {
    if (role === "student") {
      setCode(value);
      if (socket) {
        socket.emit("codeChange", { roomId: id, code: value });
      }
    }
  };
  
  const handleLeave = () => {
    navigate("/");
  };

  return (
    <Box textAlign="center" p={4} bgcolor="#254E58" minHeight="100vh">
      <Typography variant="h4" gutterBottom color="#88BDBC">
        {codeBlock ? codeBlock.name : "Loading..."}
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

      {showSmiley && (
        <Typography
          variant="h1"
          color="yellow"
          sx={{
            mt: 4,
            animation: "bounce 1s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        >
          😊
        </Typography>
      )}

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
