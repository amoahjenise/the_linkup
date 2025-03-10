import React from "react";
import logo from "../assets/logo.png";

const LoadingPage = () => {
  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.logo} />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100px", // adjust size if needed
    height: "100px", // or set height: 'auto' if you want
    objectFit: "contain",
    filter: "invert(1)",
  },
};

export default LoadingPage;
