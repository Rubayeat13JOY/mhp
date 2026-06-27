import { useEffect, useState } from "react";
import axios from "axios";

function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("profile");

  const [prescriptions, setPrescriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Share Access state
  const [doctors, setDoctors] = useState([]);
  const [myShares, setMyShares] = useState([]);
  const [shareForm, setShareForm] = useState({ doctorId: "", permission: "view", expiresAt: "" });

  const [presForm, setPresForm] = useState({ medicineName: "", dosage: "", notes: "", file: null });
  const [histForm, setHistForm] = useState({ type: "disease", title: "", description: "", date: "", file: null });
  const [repForm, setRepForm] = useState({ title: "", category: "blood_test", description: "", date: "", file: null });

  const token = localStorage.getItem("accessToken");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patient/profile", {
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

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/prescription/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(res.data.prescriptions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medical-history/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/report/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data.reports);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctor/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyShares = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/record-share/my-shares", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyShares(res.data.shares);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPrescriptions();
    fetchHistory();
    fetchReports();
    fetchNotifications();
    fetchDoctors();
    fetchMyShares();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/patient/profile", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage("Update failed!");
    }
  };

  const uploadPrescription = async () => {
    try {
      const fd = new FormData();
      fd.append("medicineName", presForm.medicineName);
      fd.append("dosage", presForm.dosage);
      fd.append("notes", presForm.notes);
      if (presForm.file) fd.append("file", presForm.file);

      await axios.post("http://localhost:5000/api/prescription/upload", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setMessage("Prescription uploaded successfully!");
      setPresForm({ medicineName: "", dosage: "", notes: "", file: null });
      fetchPrescriptions();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  const deletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/prescription/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadHistory = async () => {
    try {
      const fd = new FormData();
      fd.append("type", histForm.type);
      fd.append("title", histForm.title);
      fd.append("description", histForm.description);
      fd.append("date", histForm.date);
      if (histForm.file) fd.append("file", histForm.file);

      await axios.post("http://localhost:5000/api/medical-history/", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setMessage("Medical history added successfully!");
      setHistForm({ type: "disease", title: "", description: "", date: "", file: null });
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  const deleteHistory = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/medical-history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadReport = async () => {
    try {
      const fd = new FormData();
      fd.append("title", repForm.title);
      fd.append("category", repForm.category);
      fd.append("description", repForm.description);
      fd.append("date", repForm.date);
      if (repForm.file) fd.append("file", repForm.file);

      await axios.post("http://localhost:5000/api/report/upload", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setMessage("Report uploaded successfully!");
      setRepForm({ title: "", category: "blood_test", description: "", date: "", file: null });
      fetchReports();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const shareAccessWithDoctor = async () => {
    if (!shareForm.doctorId) {
      setMessage("Please select a doctor first");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/record-share/share",
        {
          doctorId: shareForm.doctorId,
          permission: shareForm.permission,
          expiresAt: shareForm.expiresAt || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Access shared successfully!");
      setShareForm({ doctorId: "", permission: "view", expiresAt: "" });
      fetchMyShares();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to share access");
    }
  };

  const revokeShare = async (id) => {
    if (!window.confirm("Revoke this doctor's access to your records?")) return;
    try {
      await axios.put(`http://localhost:5000/api/record-share/revoke/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Access revoked successfully!");
      fetchMyShares();
    } catch (err) {
      console.error(err);
      setMessage("Failed to revoke access");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return (
          <>
            <h1 style={styles.title}>👤 Patient Profile</h1>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.card}>
              {editing ? (
                <>
                  <div style={styles.grid}>
                    {[
                      { label: "Full Name", key: "name", type: "text" },
                      { label: "Phone", key: "phone", type: "text" },
                      { label: "Date of Birth", key: "dateOfBirth", type: "date" },
                      { label: "Blood Group", key: "bloodGroup", type: "text" },
                      { label: "Address", key: "address", type: "text" },
                      { label: "Emergency Contact Name", key: "emergencyContactName", type: "text" },
                      { label: "Emergency Contact Phone", key: "emergencyContactPhone", type: "text" },
                      { label: "Insurance Provider", key: "insuranceProvider", type: "text" },
                      { label: "Insurance Number", key: "insuranceNumber", type: "text" },
                      { label: "Medical Preferences", key: "medicalPreferences", type: "text" },
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
                    <div style={styles.field}>
                      <label style={styles.label}>Gender</label>
                      <select
                        style={styles.input}
                        value={form.gender || ""}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
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
                      { label: "Phone", value: profile?.phone },
                      { label: "Date of Birth", value: profile?.dateOfBirth },
                      { label: "Gender", value: profile?.gender },
                      { label: "Blood Group", value: profile?.bloodGroup },
                      { label: "Address", value: profile?.address },
                      {
                        label: "Emergency Contact",
                        value: `${profile?.emergencyContactName || "—"} ${profile?.emergencyContactPhone ? `(${profile.emergencyContactPhone})` : ""}`
                      },
                      {
                        label: "Insurance",
                        value: `${profile?.insuranceProvider || "—"} ${profile?.insuranceNumber ? `#${profile.insuranceNumber}` : ""}`
                      },
                      { label: "Medical Preferences", value: profile?.medicalPreferences },
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

      case "prescriptions":
        return (
          <>
            <h1 style={styles.title}>💊 Prescriptions</h1>
            {message && <p style={styles.message}>{message}</p>}
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
                <button style={styles.saveBtn} onClick={uploadPrescription}>Upload</button>
              </div>
              <p style={{ ...styles.emptyText, textAlign: "left", padding: "8px 0 0" }}>
                Upload a JPG/PNG image and we'll automatically extract the text (OCR).
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.subTitle}>My Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p style={styles.emptyText}>No prescriptions found.</p>
              ) : (
                prescriptions.map((p) => (
                  <div key={p.PrescriptionID} style={styles.listItem}>
                    <div>
                      <strong>{p.MedicineName || "—"}</strong>{p.Dosage ? ` — ${p.Dosage}` : ""}
                      <span style={{ ...styles.badge, marginLeft: "8px" }}>
                        {p.UploadedBy === "doctor" ? "By Doctor" : "By You"}
                      </span>
                      {p.Notes && <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{p.Notes}</p>}
                      {p.ExtractedText && (
                        <details style={{ marginTop: "6px" }}>
                          <summary style={{ cursor: "pointer", fontSize: "12px", color: "#4a90e2" }}>
                            View extracted text (OCR)
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
                      <button style={styles.deleteBtn} onClick={() => deletePrescription(p.PrescriptionID)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "history":
        return (
          <>
            <h1 style={styles.title}>🏥 Medical History</h1>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.card}>
              <h3 style={styles.subTitle}>Add Medical Record</h3>
              <div style={styles.formRow}>
                <select
                  style={styles.input}
                  value={histForm.type}
                  onChange={(e) => setHistForm({ ...histForm, type: e.target.value })}
                >
                  <option value="disease">Disease</option>
                  <option value="surgery">Surgery</option>
                  <option value="allergy">Allergy</option>
                  <option value="medication">Medication</option>
                  <option value="other">Other</option>
                </select>
                <input
                  style={styles.input}
                  placeholder="Title"
                  value={histForm.title}
                  onChange={(e) => setHistForm({ ...histForm, title: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Description"
                  value={histForm.description}
                  onChange={(e) => setHistForm({ ...histForm, description: e.target.value })}
                />
                <input
                  style={styles.input}
                  type="date"
                  value={histForm.date}
                  onChange={(e) => setHistForm({ ...histForm, date: e.target.value })}
                />
                <input
                  style={styles.input}
                  type="file"
                  onChange={(e) => setHistForm({ ...histForm, file: e.target.files[0] })}
                />
                <button style={styles.saveBtn} onClick={uploadHistory}>Add Record</button>
              </div>
              <p style={{ ...styles.emptyText, textAlign: "left", padding: "8px 0 0" }}>
                Upload a JPG/PNG image and we'll automatically extract the text (OCR).
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.subTitle}>History Records</h3>
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
                      <button style={styles.deleteBtn} onClick={() => deleteHistory(h.HistoryID)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "reports":
        return (
          <>
            <h1 style={styles.title}>📋 Reports</h1>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.card}>
              <h3 style={styles.subTitle}>Upload Report</h3>
              <div style={styles.formRow}>
                <input
                  style={styles.input}
                  placeholder="Report Title"
                  value={repForm.title}
                  onChange={(e) => setRepForm({ ...repForm, title: e.target.value })}
                />
                <select
                  style={styles.input}
                  value={repForm.category}
                  onChange={(e) => setRepForm({ ...repForm, category: e.target.value })}
                >
                  <option value="blood_test">Blood Test</option>
                  <option value="xray">X-Ray</option>
                  <option value="mri">MRI</option>
                  <option value="ct_scan">CT Scan</option>
                  <option value="urine_test">Urine Test</option>
                  <option value="other">Other</option>
                </select>
                <input
                  style={styles.input}
                  placeholder="Description"
                  value={repForm.description}
                  onChange={(e) => setRepForm({ ...repForm, description: e.target.value })}
                />
                <input
                  style={styles.input}
                  type="date"
                  value={repForm.date}
                  onChange={(e) => setRepForm({ ...repForm, date: e.target.value })}
                />
                <input
                  style={styles.input}
                  type="file"
                  onChange={(e) => setRepForm({ ...repForm, file: e.target.files[0] })}
                />
                <button style={styles.saveBtn} onClick={uploadReport}>Upload Report</button>
              </div>
              <p style={{ ...styles.emptyText, textAlign: "left", padding: "8px 0 0" }}>
                Upload a JPG/PNG image and we'll automatically extract the text (OCR).
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.subTitle}>My Reports</h3>
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
                      <button style={styles.deleteBtn} onClick={() => deleteReport(r.ReportID)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "share":
        return (
          <>
            <h1 style={styles.title}>🔗 Share Access with Doctor</h1>
            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.card}>
              <h3 style={styles.subTitle}>Give a Doctor Access to Your Records</h3>
              <div style={styles.formRow}>
                <select
                  style={styles.input}
                  value={shareForm.doctorId}
                  onChange={(e) => setShareForm({ ...shareForm, doctorId: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.DoctorID} value={d.DoctorID}>
                      {d.User?.name || "Unknown"}{d.Specialization ? ` — ${d.Specialization}` : ""}
                    </option>
                  ))}
                </select>
                <select
                  style={styles.input}
                  value={shareForm.permission}
                  onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
                >
                  <option value="view">View Only</option>
                  <option value="edit">View & Edit</option>
                </select>
                <input
                  style={styles.input}
                  type="date"
                  placeholder="Expires At (optional)"
                  value={shareForm.expiresAt}
                  onChange={(e) => setShareForm({ ...shareForm, expiresAt: e.target.value })}
                />
                <button style={styles.saveBtn} onClick={shareAccessWithDoctor}>Share Access</button>
              </div>
              <p style={{ ...styles.emptyText, textAlign: "left", padding: "10px 0 0" }}>
                "View Only" lets the doctor see your prescriptions, history, and reports.
                "View & Edit" also lets them add new prescriptions for you. Leave expiry blank for no expiry.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.subTitle}>Doctors With Access</h3>
              {myShares.length === 0 ? (
                <p style={styles.emptyText}>You haven't shared access with any doctor yet.</p>
              ) : (
                myShares.map((s) => (
                  <div key={s.RecordShareID || s.ShareID || s.id} style={styles.listItem}>
                    <div>
                      <strong>{s.Doctor?.User?.name || "Unknown"}</strong>
                      {s.Doctor?.Specialization && (
                        <span style={{ color: "#666", fontSize: "13px" }}> — {s.Doctor.Specialization}</span>
                      )}
                      <div style={{ marginTop: "6px" }}>
                        <span style={styles.badge}>{s.Permission}</span>
                        <span style={{
                          ...styles.badge,
                          marginLeft: "6px",
                          backgroundColor: s.IsActive ? "#e6f9ec" : "#fdeaea",
                          color: s.IsActive ? "#1f9254" : "#c0392b",
                        }}>
                          {s.IsActive ? "Active" : "Revoked"}
                        </span>
                      </div>
                      {s.ExpiresAt && (
                        <p style={{ margin: "6px 0 0", color: "#999", fontSize: "12px" }}>
                          Expires: {new Date(s.ExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div style={styles.itemActions}>
                      {s.IsActive && (
                        <button style={styles.deleteBtn} onClick={() => revokeShare(s.RecordShareID || s.ShareID || s.id)}>
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "notifications":
        return (
          <>
            <h1 style={styles.title}>🔔 Notifications</h1>
            <div style={styles.card}>
              {notifications.length === 0 ? (
                <p style={styles.emptyText}>No notifications.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.NotificationID}
                    style={{
                      ...styles.listItem,
                      backgroundColor: n.IsRead ? "#f9f9f9" : "#eef4ff",
                      borderLeft: n.IsRead ? "4px solid #ddd" : "4px solid #4a90e2",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: n.IsRead ? "normal" : "bold" }}>{n.Message}</p>
                      <p style={{ margin: "4px 0 0", color: "#999", fontSize: "12px" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.IsRead && (
                      <button style={styles.readBtn} onClick={() => markNotificationRead(n.NotificationID)}>
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const unreadCount = notifications.filter((n) => !n.IsRead).length;
  const activeShareCount = myShares.filter((s) => s.IsActive).length;

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
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "P"}
          </div>
          <p style={styles.sidebarName}>{profile?.name || "Patient"}</p>
          <p style={styles.sidebarEmail}>{profile?.email || ""}</p>
        </div>

        <nav style={styles.nav}>
          {[
            { key: "profile", label: "👤 Profile" },
            { key: "prescriptions", label: "💊 Prescriptions" },
            { key: "history", label: "🏥 Medical History" },
            { key: "reports", label: "📋 Reports" },
            {
              key: "share",
              label: `🔗 Share Access${activeShareCount > 0 ? ` (${activeShareCount})` : ""}`,
            },
            {
              key: "notifications",
              label: `🔔 Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
            },
          ].map(({ key, label }) => (
            <button
              key={key}
              style={{
                ...styles.navBtn,
                ...(activePage === key ? styles.navBtnActive : {}),
              }}
              onClick={() => { setActivePage(key); setMessage(""); }}
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
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    border: "1px solid #ffcdd2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  readBtn: {
    padding: "6px 12px",
    backgroundColor: "#e8f4fd",
    color: "#2b7de9",
    border: "1px solid #bee3f8",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    flexShrink: 0,
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
};

export default PatientDashboard;
