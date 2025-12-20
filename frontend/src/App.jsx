import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import { Landing } from "./pages/landing";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import { VideoMeet } from "./pages/VideoMeet";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:url" element={<VideoMeet />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
