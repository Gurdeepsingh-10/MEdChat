import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function App({ toggleTheme, darkMode }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = { role: "user", content: query };
    setMessages((p) => [...p, userMsg]);
    setQuery("");
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { query });
      const d = res.data;
      const botMsg = {
        role: "assistant",
        content: d.answer || "No response",
        citations: d.citations || [],
        latency: d.latency_ms,
      };
      setMessages((p) => [...p, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages((p) => [...p, { role: "assistant", content: "❌ Server error." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <Box
      sx={{
        background: darkMode
          ? "radial-gradient(circle at top left, #0d1b2a, #000)"
          : "radial-gradient(circle at top left, #e3f2fd, #fff)",
        backdropFilter: "blur(8px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="sticky"
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
            : "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
          boxShadow: darkMode
            ? "0 4px 30px rgba(0,0,0,0.4)"
            : "0 4px 30px rgba(180,200,255,0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: darkMode
                ? "linear-gradient(90deg, #b6d4ff, #4f8ef7)"
                : "linear-gradient(90deg, #4f8ef7, #1976d2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            🩺 Medicinal Chatbot
          </Typography>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tooltip title="Toggle Dark Mode">
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  backdropFilter: "blur(8px)",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  mx: 0.5,
                  "&:hover": {
                    background: "rgba(255,255,255,0.25)",
                  },
                }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear Chat">
              <IconButton
                color="inherit"
                onClick={clearChat}
                sx={{
                  backdropFilter: "blur(8px)",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  mx: 0.5,
                  "&:hover": {
                    background: "rgba(255,255,255,0.25)",
                  },
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>


      {/* CHAT AREA */}
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          py: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  backdropFilter: "blur(20px)",
                  background:
                    m.role === "user"
                      ? "rgba(79,142,247,0.25)"
                      : "rgba(255,255,255,0.2)",
                  color: m.role === "user" ? "#fff" : darkMode ? "#e0e0e0" : "#000",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "18px",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                  maxWidth: "80%",
                  backdropBlur: "15px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
                >
                  {m.content}
                </Typography>
                {m.citations?.length > 0 && (
                  <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                    📄 Sources:
                    {m.citations.map((c, idx) => (
                      <span key={idx}> [{idx + 1}] {c.split("\\").pop()} </span>
                    ))}
                  </Typography>
                )}
                {m.latency && (
                  <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                    ⚡ Latency: {m.latency.toFixed(0)} ms
                  </Typography>
                )}
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <Box sx={{ alignSelf: "center", mt: 2 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        <div ref={bottomRef} />
      </Container>

      {/* INPUT */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(15px)",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Ask a medical question..."
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#4f8ef7" },
            },
          }}
        />
        <IconButton color="primary" type="submit" disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
