import Login from "./page/login";
import Signup from "./page/signup";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <h1 style={{ fontSize: "32px", color: "#1a1a2e", margin: 0 }}>
        🏥 Medical Portal
      </h1>
      <Signup />
      <Login />
    </div>
  );
}

export default App;