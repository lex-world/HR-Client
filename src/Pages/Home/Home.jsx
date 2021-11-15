import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <Helmet>
        <title>Hash Technologies</title>
      </Helmet>
      Authentication Route: <Link to="/auth" style={{ color: "#2ecc71" }}>/auth</Link>
      <br />
      Authentication Register Employee Route:{" "}
      <Link to="/auth/new_employee" style={{ color: "#f39c12" }}>/auth/new_employee</Link>
    </div>
  );
}
