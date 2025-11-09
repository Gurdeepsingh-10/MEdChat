import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Paper,
  CircularProgress,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Preloader from "./components/Preloader";
import { GlobalStyles } from "@mui/material";

export default function App({ toggleTheme, darkMode }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const bottomRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => setMessages([]);

  if (appLoading) return <Preloader />;

  return (
    <>
      <Box
        sx={{
          background: darkMode
            ? "radial-gradient(circle at top left, #0a192f, #000)"
            : "radial-gradient(circle at top left, #f9fbff, #eaf2ff)",
          backgroundAttachment: "fixed",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: "100vh",
          width: "100vw",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          flexGrow: 1,
          py: 3,
          display: "flex",
          flexDirection: "column",
          pb: "140px",
        }}
      >
        {/* Frost Mist Layer */}
        <Box
          sx={{
            position: "absolute",
            top: "-5%",
            left: "-5%",
            width: "110%",
            height: "115%",
            background: darkMode
              ? "radial-gradient(ellipse at 50% 20%, rgba(79,142,247,0.18), transparent 70%)"
              : "radial-gradient(ellipse at 50% 20%, rgba(150,190,255,0.35), transparent 70%)",
            filter: "blur(120px)",
            zIndex: 0,
            pointerEvents: "none",
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
            {/* Logo + Title */}
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
                fontSize: { xs: "1.2rem", md: "1.1rem" },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              🩺 MedChat
            </Typography>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
                pb: "2px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  cursor: "pointer",
                  color: darkMode ? "#bcd8ff" : "#3170f0",
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
                  color: darkMode ? "#bcd8ff" : "#3170f0",
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

              <Tooltip title="Toggle Dark Mode" arrow>
                <Box
                  onClick={toggleTheme}
                  sx={{
                    cursor: "pointer",
                    color: darkMode ? "#bcd8ff" : "#3170f0",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      color: darkMode ? "#ffffff" : "#0059ff",
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  {darkMode ? (
                    <Brightness7Icon sx={{ fontSize: 22 }} />
                  ) : (
                    <Brightness4Icon sx={{ fontSize: 22 }} />
                  )}
                </Box>
              </Tooltip>

              <Tooltip title="Clear Chat" arrow>
                <Box
                  onClick={clearChat}
                  sx={{
                    cursor: "pointer",
                    color: darkMode ? "#bcd8ff" : "#3170f0",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      color: darkMode ? "#ffffff" : "#0059ff",
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 22 }} />
                </Box>
              </Tooltip>
            </Box>

            {/* Mobile Hamburger */}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <Tooltip title="Toggle Dark Mode" arrow>
                <Box
                  onClick={toggleTheme}
                  sx={{
                    cursor: "pointer",
                    color: darkMode ? "#bcd8ff" : "#3170f0",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      color: darkMode ? "#ffffff" : "#0059ff",
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  {darkMode ? (
                    <Brightness7Icon sx={{ fontSize: 22 }} />
                  ) : (
                    <Brightness4Icon sx={{ fontSize: 22 }} />
                  )}
                </Box>
              </Tooltip>

              <IconButton
                onClick={() => setMenuOpen(true)}
                sx={{
                  color: darkMode ? "#bcd8ff" : "#3170f0",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer Menu */}
        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              background: darkMode
                ? "linear-gradient(135deg, rgba(10,25,47,0.95), rgba(0,0,0,0.95))"
                : "linear-gradient(135deg, rgba(249,251,255,0.95), rgba(234,242,255,0.95))",
              backdropFilter: "blur(15px)",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={() => setMenuOpen(false)}>
              <CloseIcon sx={{ color: darkMode ? "#bcd8ff" : "#3170f0" }} />
            </IconButton>
          </Box>
          <List sx={{ p: 2 }}>
            <ListItem
              button
              onClick={() => setMenuOpen(false)}
              sx={{
                color: darkMode ? "#bcd8ff" : "#3170f0",
                mb: 1,
                borderRadius: "8px",
                "&:hover": {
                  background: darkMode
                    ? "rgba(79,142,247,0.2)"
                    : "rgba(140,190,255,0.2)",
                },
              }}
            >
              <ListItemText primary="About" />
            </ListItem>
            <ListItem
              button
              onClick={() => setMenuOpen(false)}
              sx={{
                color: darkMode ? "#bcd8ff" : "#3170f0",
                mb: 1,
                borderRadius: "8px",
                "&:hover": {
                  background: darkMode
                    ? "rgba(79,142,247,0.2)"
                    : "rgba(140,190,255,0.2)",
                },
              }}
            >
              <ListItemText primary="Docs" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                clearChat();
                setMenuOpen(false);
              }}
              sx={{
                color: darkMode ? "#bcd8ff" : "#3170f0",
                borderRadius: "8px",
                "&:hover": {
                  background: darkMode
                    ? "rgba(79,142,247,0.2)"
                    : "rgba(140,190,255,0.2)",
                },
              }}
            >
              <ListItemText primary="Clear Chat" />
            </ListItem>
          </List>
        </Drawer>

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
                initial={{
                  opacity: 0,
                  y: m.role === "user" ? 10 : -10,
                  x: m.role === "user" ? 40 : -40,
                }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                }}
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
                    maxWidth: "75%",
                    width: "fit-content",
                    minWidth: "40%",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.content}
                  </Typography>
                  {m.citations?.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1 }}
                    >
                      📄 Sources:
                      {m.citations.map((c, idx) => (
                        <span key={idx}>
                          {" "}
                          [{idx + 1}] {c.split("\\").pop()}{" "}
                        </span>
                      ))}
                    </Typography>
                  )}
                  {m.latency && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5 }}
                    >
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

        {/* FIXED FLOATING INPUT BAR */}
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
            width: { xs: "calc(100% - 3rem)", sm: "calc(100% - 4rem)", md: "728px" },
            maxWidth: "md",
            display: "flex",
            alignItems: "center",
            gap: 1,
            padding: "0.55rem 0.9rem",
            borderRadius: "50px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: darkMode
              ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(79,142,247,0.15))"
              : "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(200,220,255,0.6))",
            border: darkMode
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.1)",
            boxShadow: darkMode
              ? "0 8px 30px rgba(79,142,247,0.25)"
              : "0 8px 30px rgba(140,180,255,0.35)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
        >
          <input
            type="text"
            placeholder={isMobile ? "Press Enter to send..." : "Ask a medical question..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: darkMode ? "#fff" : "#111",
              fontSize: "1rem",
              padding: "6px 14px",
              fontFamily: "inherit",
              caretColor: darkMode ? "#bcd8ff" : "#3170f0",
              transition: "all 0.3s ease",
            }}
          />

          <IconButton
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              display: { xs: "none", sm: "flex" },
              bgcolor: darkMode
                ? "rgba(79,142,247,0.3)"
                : "rgba(120,170,255,0.4)",
              color: darkMode ? "#fff" : "#0b2540",
              border: darkMode
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: darkMode
                  ? "rgba(79,142,247,0.45)"
                  : "rgba(120,170,255,0.6)",
                transform: "scale(1.08)",
                boxShadow: darkMode
                  ? "0 0 20px rgba(79,142,247,0.45)"
                  : "0 0 20px rgba(79,142,247,0.55)",
              },
              transition: "all 0.25s ease",
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Global Style */}
        <style>{`
        input[type="text"] {
          all: unset;
          display: flex;
          flex: 1;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        input[type="text"]:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        input[type="text"]::placeholder {
          font-style: italic;
        }
        input[type="text"]::selection {
          background: rgba(79,142,247,0.25) !important;
          color: #fff !important;
        }
          * {
            scrollbar-width: none !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
          }
          html, body {
            overflow: auto !important;
            -ms-overflow-style: none;
            scrollbar-width: none !important;
          }
          html {
            scroll-behavior: smooth;
          }
          body::after {
            display: none !important;
          }
        `}</style>
      </Box>
    </>
  );
}