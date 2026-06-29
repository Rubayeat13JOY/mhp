import { useState } from "react";
import Login from "./page/login";
import Signup from "./page/signup";
import PatientDashboard from "./page/PatientDashboard";
import DoctorDashboard from "./page/DoctorDashboard";
import AdminDashboard from "./page/AdminDashboard";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const role = localStorage.getItem("role");

  if (role === "patient") return <PatientDashboard />;
  if (role === "doctor") return <DoctorDashboard />;
  if (role === "admin") return <AdminDashboard />;

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