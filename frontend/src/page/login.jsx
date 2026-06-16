import axios from "axios";
import { useState } from "react";

function Login({ goSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        res.data.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Success");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Login</h2>

      <form onSubmit={submit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <button
          style={styles.button}
          disabled={loading}
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>
      </form>

      <p style={styles.bottomText}>
        Don't have an account?
      </p>

      <button
        style={styles.linkBtn}
        onClick={goSignup}
      >
        Create New Account
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#d8caca",
    width: "400px",
    padding: "35px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "20px",
  },

  linkBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;