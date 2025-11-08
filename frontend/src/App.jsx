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
import Preloader from "./components/Preloader"; // 👈 Import the preloader

export default function App({ toggleTheme, darkMode }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true); // 👈 Preloader state
  const bottomRef = useRef(null);

  // 👇 Simulate loading delay for preloader (2.5s)
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "❌ Server error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  // 👇 Show preloader before main UI
  if (appLoading) return <Preloader />;

  return (
    <Box
      sx={{
        background: darkMode
          ? "radial-gradient(circle at top left, #0a192f, #000)"
          : "radial-gradient(circle at top left, #f9fbff, #eaf2ff)", // ✅ Chat background gradient
        backgroundAttachment: "fixed",
        position: "relative",
        minHeight: "100vh",
        flexGrow: 1,

        py: 3,
        display: "flex",
        flexDirection: "column",
        pb: "140px",
      }}
    >
      {/* ✅ Optional Frost Mist Layer */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%",
          background: darkMode
            ? "radial-gradient(ellipse at top right, rgba(79,142,247,0.15), transparent 70%)"
            : "radial-gradient(ellipse at top right, rgba(150,190,255,0.3), transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          background: darkMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))"
            : "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(230,240,255,0.6))",
          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
          boxShadow: darkMode
            ? "0 4px 30px rgba(0,0,0,0.2)"
            : "0 4px 30px rgba(180,200,255,0.3)",
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
            px: 3,
          }}
        >
          {/* Left Side — Title */}
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
              fontSize: "1.1rem",
            }}
          >
            🩺 Medicinal Chatbot
          </Typography>

          {/* Right Side — Links + Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              pb: "2px",
            }}
          >
            {/* Page Links */}
            <Typography
              variant="body1"
              sx={{
                cursor: "pointer",
                color: darkMode ? "#bcd8ff" : "#3170f0", // ✅ Accent consistency
                transition: "all 0.3s ease",
                fontWeight: 500,
                lineHeight: "1.5rem",
                "&:hover": {
                  color: darkMode ? "#ffffff" : "#0059ff",
                  transform: "translateY(-1px)",
                },
              }}
            >
              About
            </Typography>

            <Typography
              variant="body1"
              sx={{
                cursor: "pointer",
                color: darkMode ? "#bcd8ff" : "#3170f0", // ✅ Accent consistency
                transition: "all 0.3s ease",
                fontWeight: 500,
                lineHeight: "1.5rem",
                "&:hover": {
                  color: darkMode ? "#ffffff" : "#0059ff",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Docs
            </Typography>

            {/* Theme Toggle */}
            <Tooltip title="Toggle Dark Mode" arrow>
              <Box
                onClick={toggleTheme}
                sx={{
                  cursor: "pointer",
                  color: darkMode ? "#bcd8ff" : "#3170f0", // ✅ Accent consistency
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  verticalAlign: "middle",
                  "&:hover": {
                    color: darkMode ? "#ffffff" : "#0059ff",
                    transform: "scale(1.15)",
                  },
                }}
              >
                {darkMode ? (
                  <Brightness7Icon
                    sx={{ fontSize: 22, verticalAlign: "middle" }}
                  />
                ) : (
                  <Brightness4Icon
                    sx={{ fontSize: 22, verticalAlign: "middle" }}
                  />
                )}
              </Box>
            </Tooltip>

            {/* Clear Chat */}
            <Tooltip title="Clear Chat" arrow>
              <Box
                onClick={clearChat}
                sx={{
                  cursor: "pointer",
                  color: darkMode ? "#bcd8ff" : "#3170f0", // ✅ Accent consistency
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  verticalAlign: "middle",
                  "&:hover": {
                    color: darkMode ? "#ffffff" : "#0059ff",
                    transform: "scale(1.15)",
                  },
                }}
              >
                <DeleteOutlineIcon
                  sx={{ fontSize: 22, verticalAlign: "middle" }}
                />
              </Box>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CHAT AREA */}
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          py: 3,
          display: "flex",
          flexDirection: "column",
          pt: "80px",
          pb: "120px",
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
                      ? darkMode
                        ? "rgba(79,142,247,0.25)"
                        : "rgba(140,190,255,0.35)"
                      : darkMode
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.7)",
                  color: darkMode ? "#fff" : "#111",
                  border: darkMode
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "18px",
                  boxShadow: darkMode
                    ? "0 4px 30px rgba(0,0,0,0.1)"
                    : "0 4px 25px rgba(150,180,255,0.4)",
                  maxWidth: "80%",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",     // ✅ Allows natural wrapping and respects newlines
                    wordBreak: "break-word",    // ✅ Breaks long chunks properly
                  }}
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

      {/* FLOATING INPUT BAR */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          position: "fixed",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "92%", sm: "80%", md: "60%" },
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "0.45rem 0.8rem",
          borderRadius: "50px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: darkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.65)",
          border: darkMode
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(0,0,0,0.1)",
          boxShadow: darkMode
            ? "0 4px 25px rgba(0,0,0,0.3)"
            : "0 4px 25px rgba(150,180,255,0.4)",
          zIndex: 10,
        }}
      >
        <TextField
          variant="standard"
          placeholder="Ask a medical question..."
          fullWidth
          InputProps={{
            disableUnderline: true,
            style: {
              color: darkMode ? "#fff" : "#111",
              fontSize: "1rem",
              padding: "6px 14px",
            },
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            input: {
              "::placeholder": {
                color: darkMode
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(0,0,0,0.4)",
                fontStyle: "italic",
              },
            },
          }}
        />

        <IconButton
          color="primary"
          type="submit"
          disabled={loading}
          sx={{
            bgcolor: darkMode
              ? "rgba(79,142,247,0.3)"
              : "rgba(120,170,255,0.35)",
            color: darkMode ? "#fff" : "#0b2540",
            border: darkMode
              ? "1px solid rgba(255,255,255,0.2)"
              : "1px solid rgba(0,0,0,0.15)",
            "&:hover": {
              bgcolor: darkMode
                ? "rgba(79,142,247,0.5)"
                : "rgba(120,170,255,0.55)",
              boxShadow: darkMode
                ? "0 0 15px rgba(79,142,247,0.5)"
                : "0 0 15px rgba(120,170,255,0.6)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {/* Global Style */}
      <style>{`
        .frost-float {
          animation: frostGlow 6s ease-in-out infinite alternate;
        }
        @keyframes frostGlow {
          from { box-shadow: 0 8px 25px rgba(79,142,247,0.25); }
          to { box-shadow: 0 8px 45px rgba(79,142,247,0.5); }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(100,100,100,0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(120,120,120,0.5);
        }
      `}</style>
    </Box>
  );
}
<style>{`
  /* Hide ALL scrollbars globally but keep scrolling */
  * {
    scrollbar-width: none !important;   /* Firefox */
  }
  *::-webkit-scrollbar {
    display: none !important;           /* Chrome, Safari, Edge */
  }

  html, body {
    overflow: auto !important;
    -ms-overflow-style: none;           /* IE/Edge Legacy */
    scrollbar-width: none !important;   /* Firefox again */
  }

  /* Optional smooth scroll */
  html {
    scroll-behavior: smooth;
  }

  /* Keep your glow animation */
  .frost-float {
    animation: frostGlow 6s ease-in-out infinite alternate;
  }
  @keyframes frostGlow {
    from { box-shadow: 0 8px 25px rgba(79,142,247,0.25); }
    to { box-shadow: 0 8px 45px rgba(79,142,247,0.5); }
  }
`}</style>
