import React from "react";
import { Box, Typography, Paper, Container, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";



export default function About({ darkMode }) {
    return (
        <>
            {/* Background */}
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

            <Container
                maxWidth="md"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        sx={{
                            p: { xs: 3, md: 5 },
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
                            border: darkMode
                                ? "1px solid rgba(255,255,255,0.2)"
                                : "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* Main Title */}
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: darkMode
                                    ? "linear-gradient(90deg, #b6d4ff, #4f8ef7)"
                                    : "linear-gradient(90deg, #4f8ef7, #1976d2)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 3,
                            }}
                        >
                            🩺 MedChat
                        </Typography>

                        {/* Description */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                            }}
                        >
                            About This Project
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem" }}
                        >
                            MedChat is an <b>AI-powered medical assistant</b> designed to
                            provide accurate and accessible health information. Built with
                            cutting-edge technologies, it leverages{" "}
                            <b>Retrieval-Augmented Generation (RAG)</b> to deliver precise,
                            source-backed responses based on verified medical literature.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem" }}
                        >
                            The chatbot is powered by <b>Groq's fastest LLM API</b> combined
                            with <b>Qdrant Vector Database</b> for intelligent document
                            retrieval from the <b>Gale Encyclopedia of Medicine</b> – a
                            trusted medical resource. This ensures responses are not just
                            generated, but grounded in verified medical knowledge.
                        </Typography>

                        {/* Tech Stack */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mt: 4,
                                mb: 2,
                            }}
                        >
                            Technology Stack
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                                p: 2,
                                background: darkMode
                                    ? "rgba(79,142,247,0.15)"
                                    : "rgba(140,190,255,0.2)",
                                borderRadius: "12px",
                                lineHeight: 1.8,
                            }}
                        >
                            <b>Frontend:</b> React + Material-UI + Framer Motion <br />
                            <b>Backend:</b> FastAPI (Python) <br />
                            <b>AI/ML:</b> Groq API + LLaMA 3 + Qdrant Vector DB <br />
                            <b>Data Source:</b> Gale Encyclopedia of Medicine <br />
                            <b>Styling:</b> Glassmorphism + Backdrop Blur Effects
                        </Typography>

                        {/* How It Works */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mt: 4,
                                mb: 2,
                            }}
                        >
                            How It Works
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 3,
                                lineHeight: 1.8,
                            }}
                        >
                            1. <b>Document Processing:</b> Medical texts are chunked and
                            processed for semantic understanding <br />
                            2. <b>Vector Embedding:</b> Chunks are converted to embeddings
                            using advanced NLP models <br />
                            3. <b>Semantic Search:</b> User queries are matched against the
                            vector database for relevant sources <br />
                            4. <b>LLM Generation:</b> Retrieved context is passed to Groq's
                            LLM for generating accurate responses <br />
                            5. <b>Source Attribution:</b> Responses include citations to
                            original medical sources
                        </Typography>

                        <Divider
                            sx={{
                                my: 4,
                                borderColor: darkMode
                                    ? "rgba(255,255,255,0.2)"
                                    : "rgba(0,0,0,0.1)",
                            }}
                        />

                        {/* Creator Info */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                                Created with ❤️ by <b>Gurdeep Singh</b>
                            </Typography>
                        </Box>

                        {/* Footer / Legal */}
                        <Box
                            sx={{
                                mt: 4,
                                pt: 3,
                                borderTop: darkMode
                                    ? "1px solid rgba(255,255,255,0.1)"
                                    : "1px solid rgba(0,0,0,0.1)",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    opacity: 0.7,
                                    lineHeight: 1.6,
                                }}
                            >
                                <b>Data Source:</b> This project utilizes the Gale Encyclopedia
                                of Medicine as its primary knowledge base for medical
                                information.
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    opacity: 0.7,
                                    lineHeight: 1.6,
                                }}
                            >
                                <b>Disclaimer:</b> MedChat is for informational purposes only
                                and should not be considered a substitute for professional
                                medical advice. Always consult a qualified healthcare provider
                                for medical concerns.
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    opacity: 0.7,
                                    lineHeight: 1.6,
                                }}
                            >
                                <b>Copyright © 2025 MedChat.</b> All rights reserved. The Gale
                                Encyclopedia of Medicine content is used in accordance with fair
                                use policies for educational and informational purposes.
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    opacity: 0.7,
                                    lineHeight: 1.6,
                                }}
                            >
                                <b>Terms & Conditions:</b> By using MedChat, you agree that you
                                use this service at your own risk. The creators and contributors
                                are not liable for any misuse or misinterpretation of
                                information provided.
                            </Typography>
                        </Box>

                        {/* Back Link */}
                        <Box sx={{ mt: 4, pt: 3 }}>
                            <Link
                                to="/"
                                style={{
                                    color: darkMode ? "#b6d4ff" : "#4f8ef7",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = darkMode ? "#fff" : "#0059ff";
                                    e.target.style.transform = "translateX(-5px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = darkMode ? "#b6d4ff" : "#4f8ef7";
                                    e.target.style.transform = "translateX(0)";
                                }}
                            >
                                ← Back to Chat
                            </Link>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </>
    );
}