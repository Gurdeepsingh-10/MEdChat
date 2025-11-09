import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About({ darkMode }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: darkMode
                    ? "radial-gradient(circle at top left, #0a192f, #000)"
                    : "radial-gradient(circle at top left, #f9fbff, #eaf2ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    sx={{
                        maxWidth: 700,
                        p: 4,
                        borderRadius: "20px",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        background: darkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.75)",
                        color: darkMode ? "#fff" : "#111",
                        boxShadow: darkMode
                            ? "0 8px 30px rgba(79,142,247,0.25)"
                            : "0 8px 30px rgba(150,180,255,0.3)",
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                        About Medicinal Chatbot
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                        Medicinal Chatbot is an AI-powered assistant designed to provide
                        accurate and accessible health information. It uses{" "}
                        <b>Retrieval-Augmented Generation (RAG)</b> powered by{" "}
                        <b>Groq + Qdrant</b> to deliver precise responses based on verified
                        medical sources like the Gale Encyclopedia of Medicine.
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Built with React + FastAPI + MUI + Framer Motion. <br />
                        <Link to="/" style={{ color: "#4f8ef7", textDecoration: "none" }}>
                            ← Back to Chat
                        </Link>
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
}
