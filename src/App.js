import React from "react";

/**
 * @pages custom page components
 */
import Auth from "./Pages/Authentication/Auth";
import RegisterEmployee from "./Pages/Employee Registration/RegisterEmployee";
import Home from "./Pages/Home/Home";

/**
 * @packages npm registry packages
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  console.log(process.env.REACT_APP_PUBLIC_URL)
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/auth/new_employee" element={<RegisterEmployee />} />
      </Routes>
    </Router>
  );
}
