import { useState } from "react";
import Login from "./page/login";
import Signup from "./page/signup";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          color: "#1a1a2e",
          marginBottom: "20px",
        }}
      >
        🏥 Medical Portal
      </h1>

      {showLogin ? (
        <Login goSignup={() => setShowLogin(false)} />
      ) : (
        <Signup goLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;