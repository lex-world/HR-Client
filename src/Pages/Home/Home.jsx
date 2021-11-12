import React from "react";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <div className="home">
      <Helmet>
        <title>Hash Technologies</title>
      </Helmet>
      Authentication Route: <span style={{ color: "#2ecc71" }}>/auth</span>
      <br />
      Authentication Register Employee Route:{" "}
      <span style={{ color: "#f39c12" }}>/auth/new_employee</span>
    </div>
  );
}
