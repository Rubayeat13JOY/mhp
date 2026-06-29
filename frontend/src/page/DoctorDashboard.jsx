import { useEffect, useState } from "react";
import axios from "axios";

function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("patients");

  const [patients, setPatients] = useState([]);
  const [selectedShare, setSelectedShare] = useState(null); // the RecordShare entry for the selected patient
  const [patientSubTab, setPatientSubTab] = useState("prescriptions");

  const [prescriptions, setPrescriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [presForm, setPresForm] = useState({ medicineName: "", dosage: "", notes: "", file: null });

  const token = localStorage.getItem("accessToken");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.profile);
      setForm(res.data.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctor/patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data.patients);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPatients();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/doctor/profile",
        {
          specialization: form.specialization,
          phone: form.phone,
          licenseNumber: form.licenseNumber,
          chamberAddress: form.chamberAddress
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage("Update failed!");
    }
  };

  const openPatient = async (share) => {
    setSelectedShare(share);
    setPatientSubTab("prescriptions");
    setMessage("");
    await loadPatientRecords(share.Patient.PatientID);
  };

  const loadPatientRecords = async (patientId) => {
    setRecordsLoading(true);
    try {
      const [presRes, histRes, repRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/doctor/patients/${patientId}/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/doctor/patients/${patientId}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/doctor/patients/${patientId}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPrescriptions(presRes.data.prescriptions);
      setHistory(histRes.data.history);
      setReports(repRes.data.reports);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to load patient records");
    } finally {
      setRecordsLoading(false);
    }
  };

  const backToPatients = () => {
    setSelectedShare(null);
    setPrescriptions([]);
    setHistory([]);
    setReports([]);
    setMessage("");
  };

  const addPrescriptionForPatient = async () => {
    if (!selectedShare) return;
    try {
      const fd = new FormData();
      fd.append("medicineName", presForm.medicineName);
      fd.append("dosage", presForm.dosage);
      fd.append("notes", presForm.notes);
      if (presForm.file) fd.append("file", presForm.file);

      await axios.post(
        `http://localhost:5000/api/doctor/patients/${selectedShare.Patient.PatientID}/prescriptions`,
        fd,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setMessage("Prescription added successfully!");
      setPresForm({ medicineName: "", dosage: "", notes: "", file: null });
      loadPatientRecords(selectedShare.Patient.PatientID);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add prescription");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  const canEdit = selectedShare?.Permission === "edit";

  const renderPatientList = () => (
    <>
      <h1 style={styles.title}>🧑‍🤝‍🧑 My Patients</h1>
      {message && <p style={styles.message}>{message}</p>}
      <div style={styles.card}>
        {patients.length === 0 ? (
          <p style={styles.emptyText}>No patients have shared access with you yet.</p>
        ) : (
          patients.map((s) => (
            <div key={s.RecordShareID || s.id} style={styles.listItem}>
              <div>
                <strong>{s.Patient?.User?.name || "Unknown Patient"}</strong>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>
                  {s.Patient?.User?.email}
                </p>
                <div style={{ marginTop: "6px" }}>
                  <span style={styles.badge}>{s.Permission === "edit" ? "View & Edit" : "View Only"}</span>
                  {s.ExpiresAt && (
                    <span style={{ ...styles.badge, marginLeft: "6px", backgroundColor: "#fff4e0", color: "#b5750a" }}>
                      Expires {new Date(s.ExpiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={styles.itemActions}>
                <button style={styles.saveBtn} onClick={() => openPatient(s)}>View Records</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderPatientRecords = () => {
    const patientName = selectedShare?.Patient?.User?.name || "Patient";

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <button style={styles.backBtn} onClick={backToPatients}>← Back</button>
          <h1 style={{ ...styles.title, margin: 0 }}>📁 {patientName}'s Records</h1>
          <span style={styles.badge}>{canEdit ? "View & Edit" : "View Only"}</span>
        </div>
        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.subNav}>
          {[
            { key: "prescriptions", label: "💊 Prescriptions" },
            { key: "history", label: "🏥 Medical History" },
            { key: "reports", label: "📋 Reports" },
          ].map(({ key, label }) => (
            <button
              key={key}
              style={{
                ...styles.subNavBtn,
                ...(patientSubTab === key ? styles.subNavBtnActive : {}),
              }}
              onClick={() => setPatientSubTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {recordsLoading ? (
          <div style={styles.card}><p style={styles.emptyText}>Loading records...</p></div>
        ) : (
          <>
            {patientSubTab === "prescriptions" && (
              <>
                {canEdit && (
                  <div style={styles.card}>
                    <h3 style={styles.subTitle}>Add Prescription</h3>
                    <div style={styles.formRow}>
                      <input
                        style={styles.input}
                        placeholder="Medicine Name"
                        value={presForm.medicineName}
                        onChange={(e) => setPresForm({ ...presForm, medicineName: e.target.value })}
                      />
                      <input
                        style={styles.input}
                        placeholder="Dosage"
                        value={presForm.dosage}
                        onChange={(e) => setPresForm({ ...presForm, dosage: e.target.value })}
                      />
                      <input
                        style={styles.input}
                        placeholder="Notes"
                        value={presForm.notes}
                        onChange={(e) => setPresForm({ ...presForm, notes: e.target.value })}
                      />
                      <input
                        style={styles.input}
                        type="file"
                        onChange={(e) => setPresForm({ ...presForm, file: e.target.files[0] })}
                      />
                      <button style={styles.saveBtn} onClick={addPrescriptionForPatient}>Add</button>
                    </div>
                    <p style={{ ...styles.emptyText, textAlign: "left", padding: "8px 0 0" }}>
                      Upload a JPG/PNG image and we'll automatically extract the text . The patient will be notified.
                    </p>
                  </div>
                )}

                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Prescriptions</h3>
                  {prescriptions.length === 0 ? (
                    <p style={styles.emptyText}>No prescriptions found.</p>
                  ) : (
                    prescriptions.map((p) => (
                      <div key={p.PrescriptionID} style={styles.listItem}>
                        <div>
                          <strong>{p.MedicineName || "—"}</strong>{p.Dosage ? ` — ${p.Dosage}` : ""}
                          <span style={{ ...styles.badge, marginLeft: "8px" }}>
                            {p.UploadedBy === "doctor" ? "By Doctor" : "By Patient"}
                          </span>
                          {p.Notes && <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{p.Notes}</p>}
                          {p.ExtractedText && (
                            <details style={{ marginTop: "6px" }}>
                              <summary style={{ cursor: "pointer", fontSize: "12px", color: "#4a90e2" }}>
                                View text 
                              </summary>
                              <p style={{ margin: "6px 0 0", color: "#666", fontSize: "12px", whiteSpace: "pre-wrap" }}>
                                {p.ExtractedText}
                              </p>
                            </details>
                          )}
                        </div>
                        <div style={styles.itemActions}>
                          {p.FileURL && (
                            <a href={`http://localhost:5000${p.FileURL}`} target="_blank" rel="noreferrer" style={styles.viewLink}>View File</a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {patientSubTab === "history" && (
              <div style={styles.card}>
                <h3 style={styles.subTitle}>Medical History</h3>
                {history.length === 0 ? (
                  <p style={styles.emptyText}>No medical history found.</p>
                ) : (
                  history.map((h) => (
                    <div key={h.HistoryID} style={styles.listItem}>
                      <div>
                        <span style={styles.badge}>{h.Type}</span>
                        <strong style={{ marginLeft: "8px" }}>{h.Title}</strong>
                        <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{h.Description}</p>
                        {h.Date && <p style={{ margin: "2px 0 0", color: "#999", fontSize: "12px" }}>{new Date(h.Date).toLocaleDateString()}</p>}
                        {h.ExtractedText && (
                          <details style={{ marginTop: "6px" }}>
                            <summary style={{ cursor: "pointer", fontSize: "12px", color: "#4a90e2" }}>
                              View extracted text (OCR)
                            </summary>
                            <p style={{ margin: "6px 0 0", color: "#666", fontSize: "12px", whiteSpace: "pre-wrap" }}>
                              {h.ExtractedText}
                            </p>
                          </details>
                        )}
                      </div>
                      <div style={styles.itemActions}>
                        {h.FileURL && (
                          <a href={`http://localhost:5000${h.FileURL}`} target="_blank" rel="noreferrer" style={styles.viewLink}>View File</a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {patientSubTab === "reports" && (
              <div style={styles.card}>
                <h3 style={styles.subTitle}>Reports</h3>
                {reports.length === 0 ? (
                  <p style={styles.emptyText}>No reports found.</p>
                ) : (
                  reports.map((r) => (
                    <div key={r.ReportID} style={styles.listItem}>
                      <div>
                        <span style={styles.badge}>{r.Category?.replace("_", " ")}</span>
                        <strong style={{ marginLeft: "8px" }}>{r.Title}</strong>
                        <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{r.Description}</p>
                        {r.Date && <p style={{ margin: "2px 0 0", color: "#999", fontSize: "12px" }}>{new Date(r.Date).toLocaleDateString()}</p>}
                        {r.ExtractedText && (
                          <details style={{ marginTop: "6px" }}>
                            <summary style={{ cursor: "pointer", fontSize: "12px", color: "#4a90e2" }}>
                              View extracted text (OCR)
                            </summary>
                            <p style={{ margin: "6px 0 0", color: "#666", fontSize: "12px", whiteSpace: "pre-wrap" }}>
                              {r.ExtractedText}
                            </p>
                          </details>
                        )}
                      </div>
                      <div style={styles.itemActions}>
                        {r.FileURL && (
                          <a href={`http://localhost:5000${r.FileURL}`} target="_blank" rel="noreferrer" style={styles.viewLink}>View File</a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderContent = () => {
    if (activePage === "patients") {
      return selectedShare ? renderPatientRecords() : renderPatientList();
    }

    if (activePage === "profile") {
      return (
        <>
          <h1 style={styles.title}>🩺 Doctor Profile</h1>
          {message && <p style={styles.message}>{message}</p>}
          <div style={styles.card}>
            {editing ? (
              <>
                <div style={styles.grid}>
                  {[
                    { label: "Specialization", key: "specialization", type: "text" },
                    { label: "Phone", key: "phone", type: "text" },
                    { label: "License Number", key: "licenseNumber", type: "text" },
                    { label: "Chamber Address", key: "chamberAddress", type: "text" },
                  ].map(({ label, key, type }) => (
                    <div key={key} style={styles.field}>
                      <label style={styles.label}>{label}</label>
                      <input
                        style={styles.input}
                        type={type}
                        value={form[key] || ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button style={styles.saveBtn} onClick={handleUpdate}>Save Changes</button>
                  <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.grid}>
                  {[
                    { label: "Name", value: profile?.name },
                    { label: "Email", value: profile?.email },
                    { label: "Specialization", value: profile?.specialization },
                    { label: "Phone", value: profile?.phone },
                    { label: "License Number", value: profile?.licenseNumber },
                    { label: "Chamber Address", value: profile?.chamberAddress },
                  ].map(({ label, value }) => (
                    <div key={label} style={styles.infoBox}>
                      <span style={styles.infoLabel}>{label}</span>
                      <span style={styles.infoValue}>{value || "—"}</span>
                    </div>
                  ))}
                </div>
                <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit Profile</button>
              </>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div style={styles.container}>
      <style>{`
        select option {
          background-color: #ffffff;
          color: #222222;
        }
        select option:hover,
        select option:focus,
        select option:checked {
          background-color: #4a90e2 !important;
          color: #ffffff !important;
        }
      `}</style>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "D"}
          </div>
          <p style={styles.sidebarName}>{profile?.name || "Doctor"}</p>
          <p style={styles.sidebarEmail}>{profile?.email || ""}</p>
        </div>

        <nav style={styles.nav}>
          {[
            { key: "patients", label: `🧑‍🤝‍🧑 My Patients${patients.length > 0 ? ` (${patients.length})` : ""}` },
            { key: "profile", label: "🩺 Profile" },
          ].map(({ key, label }) => (
            <button
              key={key}
              style={{
                ...styles.navBtn,
                ...(activePage === key ? styles.navBtnActive : {}),
              }}
              onClick={() => { setActivePage(key); setSelectedShare(null); setMessage(""); }}
            >
              {label}
            </button>
          ))}
        </nav>

        <button style={styles.logoutBtn} onClick={logout}>🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f0f2f5",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#1a2e4a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  sidebarHeader: {
    textAlign: "center",
    padding: "20px 16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "12px",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontSize: "26px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  sidebarName: {
    margin: "0 0 4px",
    fontSize: "16px",
    fontWeight: "600",
  },
  sidebarEmail: {
    margin: 0,
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
    wordBreak: "break-all",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "0 12px",
    flex: 1,
    gap: "4px",
  },
  navBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.75)",
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  navBtnActive: {
    backgroundColor: "#4a90e2",
    color: "#fff",
  },
  logoutBtn: {
    margin: "16px 12px 0",
    background: "rgba(255,80,80,0.15)",
    border: "1px solid rgba(255,80,80,0.4)",
    color: "#ff6b6b",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
  },
  main: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a2e4a",
    marginBottom: "20px",
  },
  subTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "14px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fafafa",
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "12px",
    backgroundColor: "#f8f9fb",
    borderRadius: "8px",
  },
  infoLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "14px",
    color: "#222",
    fontWeight: "500",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #eee",
    marginBottom: "10px",
    backgroundColor: "#fafafa",
    gap: "12px",
  },
  itemActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexShrink: 0,
  },
  saveBtn: {
    padding: "9px 18px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  cancelBtn: {
    padding: "9px 18px",
    backgroundColor: "#eee",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  editBtn: {
    marginTop: "20px",
    padding: "9px 18px",
    backgroundColor: "#1a2e4a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  backBtn: {
    padding: "8px 14px",
    backgroundColor: "#eee",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    border: "1px solid #ffcdd2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  viewLink: {
    padding: "6px 12px",
    backgroundColor: "#f0fff4",
    color: "#276749",
    border: "1px solid #c6f6d5",
    borderRadius: "6px",
    fontSize: "13px",
    textDecoration: "none",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    backgroundColor: "#e8f0fe",
    color: "#3d5afe",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  message: {
    padding: "10px 14px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    border: "1px solid #c8e6c9",
  },
  emptyText: {
    color: "#999",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px 0",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
    color: "#555",
  },
  subNav: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  subNavBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    color: "#555",
    border: "1px solid #ddd",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  subNavBtnActive: {
    backgroundColor: "#1a2e4a",
    color: "#fff",
    border: "1px solid #1a2e4a",
  },
};

export default DoctorDashboard;
