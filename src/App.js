import React from "react";
import "./App.scss";

/**
 * @pages custom page components
 */
import Auth from "./Pages/Authentication/Auth";

/**
 * @packages npm registry packages
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  console.log(process.env.REACT_APP_PUBLIC_URL)
  return (
    <Router>
      <Routes>
        <Route exact path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}
