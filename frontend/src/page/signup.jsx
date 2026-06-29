import axios from "axios";
import { useState } from "react";

function Signup({ goLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "patient") window.location.href = "/patient-dashboard";
      else if (res.data.role === "doctor") window.location.href = "/doctor-dashboard";
      else if (res.data.role === "admin") window.location.href = "/admin-dashboard";

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        Create Account
      </h2>

      <form onSubmit={submit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Full Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <select
          style={styles.input}
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="patient">
            Patient
          </option>
          <option value="doctor">
            Doctor
          </option>
          <option value="admin">
            Admin
          </option>
        </select>

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <button
          style={styles.button}
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Sign Up"}
        </button>
      </form>

      <p style={styles.bottomText}>
        Already have an account?
      </p>

      <button
        style={styles.linkBtn}
        onClick={goLogin}
      >
        Login
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
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
    background: "#11998e",
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
    color: "#11998e",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Signup;