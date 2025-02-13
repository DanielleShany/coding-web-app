import React from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ✅ Define Props Interface
interface CodeBlockProps {
  id: string;
  name: string;
}

const CodeBlockItem: React.FC<CodeBlockProps> = ({ id, name }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={6} sm={3}>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate(`/codeblock/${id}`)}
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
        {name}
      </Button>
    </Grid>
  );
};

export default CodeBlockItem;
