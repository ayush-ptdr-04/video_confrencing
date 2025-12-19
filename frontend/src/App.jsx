import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import { Landing } from "./pages/landing";
import Authentication from "./pages/Authentication";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </>
  );
}

export default App;
