import React from "react";
import "./Preloader.css"; // We'll create this file next

const Preloader = () => {
    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "radial-gradient(circle at top left, #0a192f, #000)", // matches your frosted theme
            }}
        >
            <div className="loader">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <defs>
                        <mask id="clipping">
                            <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                            <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                            <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                            <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                            <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                            <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                            <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                        </mask>
                    </defs>
                </svg>
                <div className="box"></div>
            </div>
        </div>
    );
};

export default Preloader;
