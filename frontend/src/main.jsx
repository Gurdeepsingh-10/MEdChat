import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import App from "./App.jsx";
import About from "./pages/About";
import Docs from "./pages/Docs";

function Root() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((p) => !p);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#4f8ef7" },
          background: {
            default: darkMode ? "#0a0f1f" : "#e9f0ff",
            paper: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
          },
        },
        typography: {
          fontFamily: '"Poppins", sans-serif',
          body1: { fontSize: "1.05rem" },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 16 },
      }),
    [darkMode]
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<App toggleTheme={toggleTheme} darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/docs" element={<Docs darkMode={darkMode} />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);