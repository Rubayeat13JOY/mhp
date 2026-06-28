import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [failedLogins, setFailedLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  const fetchAll = async () => {
    try {
      const [statsRes, analyticsRes, usersRes, logsRes, failedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/activity-logs", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/security/failed-logins", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats(statsRes.data.stats);
      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setLogs(logsRes.data.logs);
      setFailedLogins(failedRes.data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User deleted successfully");
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete user");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>A</div>
          <span style={styles.brandName}>MedPortal</span>
        </div>

        <nav style={styles.nav}>
          <div
            style={{ ...styles.navItem, ...(activePage === "overview" ? styles.navItemActive : {}) }}
            onClick={() => setActivePage("overview")}
          >
            Overview
          </div>
          <div
            style={{ ...styles.navItem, ...(activePage === "users" ? styles.navItemActive : {}) }}
            onClick={() => setActivePage("users")}
          >
            User management
          </div>
          <div
            style={{ ...styles.navItem, ...(activePage === "activity" ? styles.navItemActive : {}) }}
            onClick={() => setActivePage("activity")}
          >
            Activity logs
          </div>
          <div
            style={{ ...styles.navItem, ...(activePage === "security" ? styles.navItemActive : {}) }}
            onClick={() => setActivePage("security")}
          >
            Security monitoring
          </div>
        </nav>

        <div style={styles.sidebarFooter} onClick={logout}>
          Log out
        </div>
      </aside>

      <main style={styles.main}>
        {message && <div style={styles.messageBar}>{message}</div>}

        {activePage === "overview" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Admin overview</h1>
              <p style={styles.pageSubtitle}>System-wide statistics and analytics</p>
            </div>

            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total users</p>
                <p style={styles.statValue}>{stats?.totalUsers ?? 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Patients</p>
                <p style={styles.statValue}>{stats?.totalPatients ?? 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Doctors</p>
                <p style={styles.statValue}>{stats?.totalDoctors ?? 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Admins</p>
                <p style={styles.statValue}>{stats?.totalAdmins ?? 0}</p>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>System analytics</h3>

            <div style={styles.statGrid}>
              <div style={styles.statCardSm}>
                <p style={styles.statLabel}>Prescriptions</p>
                <p style={styles.statValueSm}>{analytics?.totalPrescriptions ?? 0}</p>
              </div>
              <div style={styles.statCardSm}>
                <p style={styles.statLabel}>History records</p>
                <p style={styles.statValueSm}>{analytics?.totalMedicalHistory ?? 0}</p>
              </div>
              <div style={styles.statCardSm}>
                <p style={styles.statLabel}>Reports</p>
                <p style={styles.statValueSm}>{analytics?.totalReports ?? 0}</p>
              </div>
              <div style={styles.statCardSm}>
                <p style={styles.statLabel}>Active shares</p>
                <p style={styles.statValueSm}>{analytics?.totalActiveShares ?? 0}</p>
              </div>
            </div>
          </>
        )}

        {activePage === "users" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>User management</h1>
              <p style={styles.pageSubtitle}>{users.length} registered users</p>
            </div>

            <div style={styles.card}>
              <div style={styles.list}>
                {users.map((u) => (
                  <div key={u.id} style={styles.listItem}>
                    <div style={styles.avatar}>{initials(u.name)}</div>
                    <div style={{ flex: 1 }}>
                      <p style={styles.listTitle}>{u.name}</p>
                      <p style={styles.listSubtitle}>{u.email}</p>
                    </div>
                    <span style={styles.roleBadge}>{u.role}</span>
                    {u.role !== "admin" && (
                      <button style={styles.deleteBtn} onClick={() => deleteUser(u.id)}>Delete</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePage === "activity" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Activity logs</h1>
              <p style={styles.pageSubtitle}>Recent system activity ({logs.length})</p>
            </div>

            <div style={styles.card}>
              {logs.length === 0 ? (
                <p style={styles.emptyInline}>No activity recorded yet</p>
              ) : (
                <div style={styles.list}>
                  {logs.map((log) => (
                    <div key={log.id} style={styles.listItem}>
                      <div style={{ flex: 1 }}>
                        <p style={styles.listTitle}>
                          {log.User?.name || "Unknown user"}
                          <span style={styles.actionBadge}>{log.Action}</span>
                        </p>
                        <p style={styles.listSubtitle}>{log.Description}</p>
                        <p style={styles.timestamp}>{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        ...(log.Status === "success" ? styles.statusSuccess : styles.statusFailed)
                      }}>
                        {log.Status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activePage === "security" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Security monitoring</h1>
              <p style={styles.pageSubtitle}>Failed login attempts ({failedLogins.length})</p>
            </div>

            <div style={styles.card}>
              {failedLogins.length === 0 ? (
                <p style={styles.emptyInline}>No failed login attempts detected</p>
              ) : (
                <div style={styles.list}>
                  {failedLogins.map((log) => (
                    <div key={log.id} style={styles.listItem}>
                      <div style={{ flex: 1 }}>
                        <p style={styles.listTitle}>{log.User?.email || "Unknown email"}</p>
                        <p style={styles.listSubtitle}>{log.Description}</p>
                        <p style={styles.timestamp}>{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                      <span style={{ ...styles.statusBadge, ...styles.statusFailed }}>failed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", background: "#f7f8fa" },

  sidebar: { width: "240px", background: "#fff", borderRight: "1px solid #e8e9ed", display: "flex", flexDirection: "column", padding: "24px 16px" },
  brand: { display: "flex", alignItems: "center", gap: "10px", padding: "0 8px 28px" },
  brandIcon: { width: "32px", height: "32px", borderRadius: "8px", background: "#c0392b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" },
  brandName: { fontSize: "16px", fontWeight: "600", color: "#1a1a2e" },

  nav: { display: "flex", flexDirection: "column", gap: "2px", flex: 1 },
  navItem: { padding: "10px 12px", borderRadius: "8px", cursor: "pointer", color: "#555", fontSize: "14px", fontWeight: "500" },
  navItemActive: { background: "#fdeeee", color: "#c0392b" },

  sidebarFooter: { padding: "10px 12px", borderRadius: "8px", cursor: "pointer", color: "#e74c3c", fontSize: "14px", fontWeight: "500" },

  main: { flex: 1, padding: "32px 40px", maxWidth: "960px" },
  pageHeader: { marginBottom: "24px" },
  pageTitle: { fontSize: "22px", fontWeight: "600", color: "#1a1a2e", margin: "0 0 4px" },
  pageSubtitle: { fontSize: "14px", color: "#888", margin: 0 },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" },
  statCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e9ed", padding: "18px" },
  statLabel: { fontSize: "12px", color: "#888", margin: "0 0 6px" },
  statValue: { fontSize: "24px", fontWeight: "600", color: "#1a1a2e", margin: 0 },

  statCardSm: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e9ed", padding: "16px" },
  statValueSm: { fontSize: "20px", fontWeight: "600", color: "#1a1a2e", margin: "4px 0 0" },

  sectionTitle: { fontSize: "16px", fontWeight: "600", color: "#1a1a2e", margin: "0 0 14px" },

  card: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e9ed", padding: "20px" },
  list: { display: "flex", flexDirection: "column" },
  listItem: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f1f2f5" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#eef4ff", color: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "12px", flexShrink: 0 },
  listTitle: { margin: 0, fontSize: "13px", fontWeight: "600", color: "#1a1a2e", display: "flex", alignItems: "center", gap: "8px" },
  listSubtitle: { margin: "3px 0 0", fontSize: "12px", color: "#888" },
  timestamp: { margin: "3px 0 0", fontSize: "11px", color: "#bbb" },
  emptyInline: { color: "#aaa", fontSize: "13px", padding: "8px 0", margin: 0 },

  roleBadge: { fontSize: "11px", color: "#1877f2", background: "#eef4ff", padding: "3px 10px", borderRadius: "10px", textTransform: "capitalize" },
  actionBadge: { fontSize: "11px", color: "#1877f2", background: "#eef4ff", padding: "2px 8px", borderRadius: "10px", textTransform: "capitalize" },
  statusBadge: { fontSize: "11px", padding: "3px 10px", borderRadius: "10px", textTransform: "capitalize", alignSelf: "flex-start" },
  statusSuccess: { background: "#e8f8ee", color: "#1e8449" },
  statusFailed: { background: "#fdeeee", color: "#c0392b" },

  deleteBtn: { padding: "6px 14px", border: "1px solid #f1c4c4", background: "#fdeeee", color: "#c0392b", borderRadius: "8px", cursor: "pointer", fontSize: "12px" },

  messageBar: { background: "#e8f8ee", color: "#1e8449", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", marginBottom: "16px" },

  loadingScreen: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  spinner: { width: "32px", height: "32px", border: "3px solid #e8e9ed", borderTopColor: "#c0392b", borderRadius: "50%" },
};

export default AdminDashboard;
