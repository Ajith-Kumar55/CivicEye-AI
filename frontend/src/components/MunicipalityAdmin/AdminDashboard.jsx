import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import ResolutionFeed from "../ResolutionFeed";
import StatusTimeline from "../StatusTimeline";
import {
  FaTasks,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaFire,
  FaTrashAlt,
  FaRoad,
  FaTint,
  FaCheckDouble,
  FaFilter,
  FaSync,
  FaEye,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave
} from "react-icons/fa";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real backend database stats & complaints
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    high_severity: 0,
    issue_counts: {
      Garbage: 0,
      Pothole: 0,
      "Water Leakage": 0,
      "No Issue Detected": 0
    },
    status_counts: {
      Pending: 0,
      "In Progress": 0,
      Resolved: 0
    }
  });

  const [complaintsList, setComplaintsList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filters
  const [filterIssue, setFilterIssue] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");

  const [viewArchivedFilter, setViewArchivedFilter] = useState(false);
  const [archiveConfirmItem, setArchiveConfirmItem] = useState(null);

  // Fetch real data from backend SQLite database
  const fetchDataFromBackend = async (archivedMode = viewArchivedFilter) => {
    try {
      setRefreshing(true);

      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch complaints
      const complaintsRes = await fetch(`${API_BASE_URL}/api/admin/complaints?show_archived=${archivedMode}`);
      if (complaintsRes.ok) {
        const complaintsData = await complaintsRes.json();
        setComplaintsList(complaintsData);
      }
    } catch (error) {
      console.error("Failed to fetch real data from backend:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchDataFromBackend(viewArchivedFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewArchivedFilter]);

  const handleArchiveComplaint = async (complaintId) => {
    try {
      const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";
      const res = await fetch(`${API_BASE_URL}/api/admin/complaints/${complaintId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setArchiveConfirmItem(null);
        setSelectedComplaint(null);
        fetchDataFromBackend(viewArchivedFilter);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to archive complaint.");
      }
    } catch (err) {
      console.error("Error archiving complaint:", err);
    }
  };

  const handleRestoreComplaint = async (complaintId) => {
    try {
      const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";
      const res = await fetch(`${API_BASE_URL}/api/admin/complaints/${complaintId}/restore`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      if (res.ok) {
        fetchDataFromBackend(viewArchivedFilter);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to restore complaint.");
      }
    } catch (err) {
      console.error("Error restoring complaint:", err);
    }
  };

  // Update complaint status, department, or notes in backend database
  const handleUpdateComplaint = async (complaintId, updatedFields) => {
    try {
      const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";
      const res = await fetch(`${API_BASE_URL}/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (res.ok) {
        // Optimistically update local list and modal state
        setComplaintsList((prev) =>
          prev.map((item) =>
            item.id === complaintId ? { ...item, ...updatedFields } : item
          )
        );

        if (selectedComplaint && selectedComplaint.id === complaintId) {
          setSelectedComplaint((prev) => ({ ...prev, ...updatedFields }));
        }

        fetchDataFromBackend();
      } else {
        alert("Failed to update complaint status on server.");
      }
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Network error updating complaint.");
    }
  };

  // Filter complaints list
  const filteredComplaints = complaintsList.filter((item) => {
    const issueStr = (item.issue || "").toLowerCase();

    const matchesSearch =
      !searchTerm ||
      issueStr.includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.citizen_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      `CEV-${item.id}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIssue =
      filterIssue === "ALL" ||
      (filterIssue === "Garbage" && issueStr.includes("garbage")) ||
      (filterIssue === "Pothole" && issueStr.includes("pothole")) ||
      (filterIssue === "Water Leakage" && issueStr.includes("water")) ||
      (filterIssue === "No Issue Detected" && issueStr.includes("no issue"));

    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;

    const matchesSeverity =
      filterSeverity === "ALL" || item.severity === filterSeverity;

    const matchesDepartment =
      filterDepartment === "ALL" || item.department === filterDepartment;

    const matchesDate =
      !filterDate || (item.time && item.time.startsWith(filterDate));

    return (
      matchesSearch &&
      matchesIssue &&
      matchesStatus &&
      matchesSeverity &&
      matchesDepartment &&
      matchesDate
    );
  });

  const total = stats.total_complaints || 1; // Prevent div by 0

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ marginLeft: "260px", padding: "25px 35px" }}>
        <AdminNavbar
          onLogout={onLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {activeTab === "feed" ? (
          <ResolutionFeed userRole="admin" />
        ) : (
          <div>
            {/* REFRESH & TITLE BANNER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#06b6d4", fontSize: "28px" }}>
              🏛️ Municipality Admin Complaint Management
            </h1>
            <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
              Real Citizen Public Issue Triage, Evidence Review & Resolution System
            </p>
          </div>

          <button
            onClick={fetchDataFromBackend}
            disabled={refreshing}
            style={{
              background: "#1e293b",
              color: "#06b6d4",
              border: "1px solid #06b6d4",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaSync className={refreshing ? "fa-spin" : ""} />
            {refreshing ? "Syncing..." : "Sync Database"}
          </button>
        </div>

        {/* 1. DASHBOARD CARDS (REAL BACKEND DATA) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "35px"
          }}
        >
          <StatCard
            title="Total Complaints"
            value={stats.total_complaints}
            color="#38bdf8"
            icon={<FaTasks />}
            subtitle="Real Backend DB Total"
          />
          <StatCard
            title="Pending Complaints"
            value={stats.pending}
            color="#f59e0b"
            icon={<FaExclamationTriangle />}
            subtitle="Awaiting Resolution"
          />
          <StatCard
            title="In Progress"
            value={stats.in_progress}
            color="#3b82f6"
            icon={<FaSpinner />}
            subtitle="Assigned to Field Team"
          />
          <StatCard
            title="Resolved Complaints"
            value={stats.resolved}
            color="#10b981"
            icon={<FaCheckCircle />}
            subtitle="Completed & Closed"
          />
          <StatCard
            title="High Priority"
            value={stats.high_severity}
            color="#ef4444"
            icon={<FaFire />}
            subtitle="High Severity Issues"
          />
        </div>

        {/* 2. ISSUE & STATUS STATISTICS SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "25px",
            marginBottom: "35px"
          }}
        >
          {/* ISSUE STATISTICS */}
          <div style={cardSectionStyle}>
            <h3 style={{ margin: "0 0 20px", color: "#38bdf8" }}>
              📊 Issue Type Statistics
            </h3>

            <StatProgressRow
              label="Garbage Accumulation"
              count={stats.issue_counts.Garbage || 0}
              total={total}
              color="#ef4444"
              icon={<FaTrashAlt color="#ef4444" />}
            />
            <StatProgressRow
              label="Potholes & Road Damage"
              count={stats.issue_counts.Pothole || 0}
              total={total}
              color="#f59e0b"
              icon={<FaRoad color="#f59e0b" />}
            />
            <StatProgressRow
              label="Water Leakage"
              count={stats.issue_counts["Water Leakage"] || 0}
              total={total}
              color="#06b6d4"
              icon={<FaTint color="#06b6d4" />}
            />
            <StatProgressRow
              label="No Issue Detected"
              count={stats.issue_counts["No Issue Detected"] || 0}
              total={total}
              color="#10b981"
              icon={<FaCheckDouble color="#10b981" />}
            />
          </div>

          {/* STATUS STATISTICS */}
          <div style={cardSectionStyle}>
            <h3 style={{ margin: "0 0 20px", color: "#38bdf8" }}>
              📈 Status Statistics & Resolution Rate
            </h3>

            <StatProgressRow
              label="Pending Triage"
              count={stats.status_counts.Pending || 0}
              total={total}
              color="#f59e0b"
              icon={<FaExclamationTriangle color="#f59e0b" />}
            />
            <StatProgressRow
              label="In Progress (Assigned)"
              count={stats.status_counts["In Progress"] || 0}
              total={total}
              color="#3b82f6"
              icon={<FaSpinner color="#3b82f6" />}
            />
            <StatProgressRow
              label="Resolved & Cleared"
              count={stats.status_counts.Resolved || 0}
              total={total}
              color="#10b981"
              icon={<FaCheckCircle color="#10b981" />}
            />

            <div
              style={{
                marginTop: "25px",
                padding: "15px",
                background: "#0f172a",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                Resolution Success Rate:
              </span>
              <b style={{ color: "#10b981", fontSize: "18px" }}>
                {Math.round(((stats.resolved || 0) / total) * 100)}%
              </b>
            </div>
          </div>
        </div>

        {/* 3. FILTERS & COMPLAINT MANAGEMENT SECTION */}
        <div style={cardSectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >
            <h3 style={{ margin: 0, color: "#38bdf8" }}>
              📋 All Citizen Complaints ({filteredComplaints.length})
            </h3>

            {/* VIEW MODE TOGGLE: ACTIVE VS ARCHIVED */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button
                onClick={() => setViewArchivedFilter(false)}
                style={{
                  background: !viewArchivedFilter ? "#06b6d4" : "#1e293b",
                  color: "#fff",
                  border: "1px solid #06b6d4",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                📋 Active Complaints
              </button>

              <button
                onClick={() => setViewArchivedFilter(true)}
                style={{
                  background: viewArchivedFilter ? "#ef4444" : "#1e293b",
                  color: "#fff",
                  border: "1px solid #ef4444",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                📦 Archived Complaints
              </button>
            </div>

            {/* MULTI-CRITERIA FILTERS */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FaFilter color="#06b6d4" />
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Filter:</span>
              </div>

              {/* Issue Filter */}
              <select
                value={filterIssue}
                onChange={(e) => setFilterIssue(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="ALL">All Issue Types</option>
                <option value="Garbage">Garbage</option>
                <option value="Pothole">Pothole</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="No Issue Detected">No Issue</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="ALL">All Severities</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="ALL">All Departments</option>
                <option value="PWD & Roads">PWD & Roads</option>
                <option value="Solid Waste Mgmt">Solid Waste Mgmt</option>
                <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ ...filterSelectStyle, color: "#fff" }}
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0 8px",
                    cursor: "pointer"
                  }}
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* COMPLAINTS TABLE */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#38bdf8" }}>
              Loading real complaint records from database...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              No complaints found matching the active search and filter criteria.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left"
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #334155", color: "#94a3b8" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Citizen Name</th>
                    <th style={thStyle}>Issue Type</th>
                    <th style={thStyle}>Confidence</th>
                    <th style={thStyle}>Severity</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Department</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date/Time</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #334155",
                        transition: "0.2s"
                      }}
                    >
                      <td style={tdStyle}>
                        <b>#CEV-{1000 + item.id}</b>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#cbd5e1", fontWeight: "600" }}>
                          {item.citizen_name || "Registered Citizen"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <b style={{ color: "#38bdf8" }}>{item.issue}</b>
                      </td>
                      <td style={tdStyle}>{item.confidence}%</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            background:
                              item.severity === "HIGH"
                                ? "#ef4444"
                                : item.severity === "MEDIUM"
                                ? "#f59e0b"
                                : "#10b981",
                            color: "#fff",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "bold"
                          }}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, maxWidth: "160px" }}>
                        {item.location || "Bengaluru Ward Area"}
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={item.department || "PWD & Roads"}
                          onChange={(e) =>
                            handleUpdateComplaint(item.id, {
                              department: e.target.value
                            })
                          }
                          style={tableSelectStyle}
                        >
                          <option value="PWD & Roads">PWD & Roads</option>
                          <option value="Solid Waste Mgmt">Solid Waste Mgmt</option>
                          <option value="Water Supply & Sewerage">
                            Water Supply & Sewerage
                          </option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={item.status || "Pending"}
                          onChange={(e) =>
                            handleUpdateComplaint(item.id, {
                              status: e.target.value
                            })
                          }
                          style={{
                            ...tableSelectStyle,
                            background:
                              item.status === "Resolved"
                                ? "#10b981"
                                : item.status === "In Progress"
                                ? "#0284c7"
                                : item.status === "Rejected"
                                ? "#ef4444"
                                : "#f59e0b",
                            color: "#fff",
                            fontWeight: "bold"
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ ...tdStyle, color: "#94a3b8", fontSize: "12px" }}>
                        {item.time || "Recent"}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => setSelectedComplaint(item)}
                            style={{
                              background: "#06b6d4",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <FaEye /> View Details
                          </button>

                          {item.status === "Resolved" && !viewArchivedFilter && (
                            <button
                              onClick={() => setArchiveConfirmItem(item)}
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                              }}
                            >
                              📦 Archive
                            </button>
                          )}

                          {viewArchivedFilter && (
                            <button
                              onClick={() => handleRestoreComplaint(item.id)}
                              style={{
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                              }}
                            >
                              🔄 Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

      {/* ADMIN CONFIRMATION DIALOG FOR ARCHIVING COMPLAINT */}
      {archiveConfirmItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "2px solid #ef4444",
              padding: "25px",
              borderRadius: "16px",
              maxWidth: "450px",
              width: "90%",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}
          >
            <h3 style={{ margin: "0 0 12px", color: "#ef4444" }}>
              📦 Archive Resolved Complaint?
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              Are you sure you want to archive Complaint #{archiveConfirmItem.id}? It will be hidden from active triage while preserving all data and resolution records safely.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => setArchiveConfirmItem(null)}
                style={{
                  background: "#475569",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => handleArchiveComplaint(archiveConfirmItem.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPLAINT DETAILS MODAL */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdate={handleUpdateComplaint}
        />
      )}
    </div>
  );
}

// DETAILED COMPLAINT INSPECTION MODAL COMPONENT
function ComplaintDetailModal({ complaint, onClose, onUpdate }) {
  const [status, setStatus] = useState(complaint.status || "Pending");
  const [department, setDepartment] = useState(complaint.department || "PWD & Roads");
  const [officerNotes, setOfficerNotes] = useState(complaint.officer_notes || "");
  
  // Resolution specific state
  const [resTitle, setResTitle] = useState(complaint.resolution_title || `${complaint.issue || "Issue"} Resolved`);
  const [resDesc, setResDesc] = useState(complaint.resolution_description || officerNotes || "Municipality road maintenance team repaired and verified the issue.");
  const [resFile, setResFile] = useState(null);
  const [resFilePreview, setResFilePreview] = useState(complaint.resolution_image || "");
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResFile(file);
      setResFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";

    // 1. Regular status / department / notes update
    await onUpdate(complaint.id, {
      status,
      department,
      officer_notes: officerNotes
    });

    // 2. Upload resolution proof if status is set to Resolved
    if (status === "Resolved") {
      try {
        const formData = new FormData();
        formData.append("resolution_title", resTitle);
        formData.append("resolution_description", resDesc);
        if (resFile) {
          formData.append("resolution_image", resFile);
        }

        await fetch(`${API_BASE_URL}/api/admin/complaints/${complaint.id}/resolve`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${adminToken}`
          },
          body: formData
        });
      } catch (err) {
        console.error("Resolution submit error:", err);
      }
    }

    setSaving(false);
    onClose();
  };

  // Image source construction
  let imageSrc = null;
  if (complaint.prediction_image) {
    if (complaint.prediction_image.startsWith("http")) {
      imageSrc = complaint.prediction_image;
    } else if (complaint.prediction_image.startsWith("result/")) {
      imageSrc = `${API_BASE_URL}/prediction/${complaint.prediction_image.replace("result/", "")}`;
    } else {
      imageSrc = `${API_BASE_URL}/prediction/${complaint.prediction_image}`;
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#1e293b",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
          border: "2px solid #06b6d4",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          padding: "30px",
          color: "#fff",
          position: "relative"
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px"
          }}
        >
          <FaTimes />
        </button>

        {/* MODAL HEADER */}
        <div style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0, color: "#06b6d4" }}>
              🔍 Complaint Details: #CEV-{1000 + complaint.id}
            </h2>
            <span
              style={{
                background:
                  status === "Resolved"
                    ? "#10b981"
                    : status === "In Progress"
                    ? "#0284c7"
                    : status === "Rejected"
                    ? "#ef4444"
                    : "#f59e0b",
                color: "#fff",
                padding: "4px 14px",
                borderRadius: "14px",
                fontSize: "12px",
                fontWeight: "bold"
              }}
            >
              {status}
            </span>
          </div>
          <p style={{ margin: "5px 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Submitted on {complaint.time || "N/A"}
          </p>
        </div>

        {/* REAL COMPLAINT STATUS TIMELINE */}
        <StatusTimeline complaint={{ ...complaint, status }} language="English" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          {/* LEFT COLUMN: EVIDENCE IMAGE & AI ANALYSIS */}
          <div>
            <h4 style={{ color: "#38bdf8", marginTop: 0, marginBottom: "10px" }}>
              📸 AI Photo Evidence & Detection
            </h4>

            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Complaint Evidence"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "14px",
                  border: "2px solid #334155",
                  marginBottom: "15px"
                }}
              />
            ) : (
              <div
                style={{
                  height: "180px",
                  background: "#0f172a",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#64748b",
                  marginBottom: "15px"
                }}
              >
                No Image Evidence Attached
              </div>
            )}

            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", fontSize: "14px" }}>
              <div style={{ marginBottom: "8px" }}>
                <b>Issue Detected:</b> <span style={{ color: "#38bdf8" }}>{complaint.issue}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <b>AI Confidence:</b> {complaint.confidence}%
              </div>
              <div>
                <b>Severity Tag:</b>{" "}
                <span
                  style={{
                    color:
                      complaint.severity === "HIGH"
                        ? "#ef4444"
                        : complaint.severity === "MEDIUM"
                        ? "#f59e0b"
                        : "#10b981",
                    fontWeight: "bold"
                  }}
                >
                  {complaint.severity}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CITIZEN INFO & LOCATION */}
          <div>
            <h4 style={{ color: "#38bdf8", marginTop: 0, marginBottom: "10px" }}>
              👤 Citizen & Contact Information
            </h4>
            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", marginBottom: "18px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <FaUser color="#06b6d4" /> <b>Name:</b> {complaint.citizen_name || "Registered Citizen"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <FaEnvelope color="#06b6d4" /> <b>Email:</b> {complaint.citizen_email || "citizen@civiceye.com"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaPhone color="#06b6d4" /> <b>Phone:</b> {complaint.citizen_phone || "+91 9876543210"}
              </div>
            </div>

            <h4 style={{ color: "#38bdf8", margin: "0 0 10px" }}>
              📍 Location & Citizen Description
            </h4>
            <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", fontSize: "13px" }}>
              <div style={{ marginBottom: "8px" }}>
                <FaMapMarkerAlt color="#ef4444" /> <b>Location Address:</b>
                <p style={{ margin: "4px 0 0", color: "#cbd5e1" }}>
                  {complaint.location || "Location recorded via GPS"}
                </p>
              </div>
              <div>
                <b>Problem Description:</b>
                <p style={{ margin: "4px 0 0", color: "#cbd5e1" }}>
                  {complaint.description || "Public issue reported by citizen."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OFFICER MANAGEMENT & RESOLUTION PROOF FORM */}
        <div style={{ marginTop: "25px", borderTop: "1px solid #334155", paddingTop: "20px" }}>
          <h4 style={{ color: "#38bdf8", marginTop: 0, marginBottom: "15px" }}>
            🛠️ Municipal Officer Action & Resolution Settings
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94a3b8" }}>
                Assign Department:
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ ...filterSelectStyle, width: "100%", padding: "10px" }}
              >
                <option value="PWD & Roads">PWD & Roads</option>
                <option value="Solid Waste Mgmt">Solid Waste Mgmt</option>
                <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94a3b8" }}>
                Update Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ ...filterSelectStyle, width: "100%", padding: "10px" }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">🟢 Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* DEDICATED RESOLUTION PROOF FORM (WHEN STATUS IS RESOLVED) */}
          {status === "Resolved" && (
            <div
              style={{
                background: "linear-gradient(145deg, #064e3b, #0f172a)",
                padding: "20px",
                borderRadius: "14px",
                border: "2px solid #10b981",
                marginBottom: "20px"
              }}
            >
              <h4 style={{ margin: "0 0 14px", color: "#34d399" }}>
                🏆 Resolution Proof Form (Visible to Citizen)
              </h4>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#a7f3d0" }}>
                  Resolution Title:
                </label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Road Pothole Resolved"
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    color: "#fff",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#a7f3d0" }}>
                  Action Taken / Resolution Description:
                </label>
                <textarea
                  rows="3"
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="e.g. Municipality road maintenance team repaired the pothole."
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    color: "#fff",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#a7f3d0" }}>
                  Upload Resolution After-Fix Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #10b981",
                    width: "100%",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                />
                {resFilePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={resFilePreview}
                      alt="Resolution Preview"
                      style={{
                        maxHeight: "120px",
                        borderRadius: "8px",
                        border: "1px solid #10b981"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94a3b8" }}>
              Officer Internal Dispatch / Notes:
            </label>
            <textarea
              rows="2"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Internal municipal notes..."
              style={{
                width: "100%",
                background: "#0f172a",
                color: "#fff",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "10px",
                outline: "none",
                fontSize: "13px",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              onClick={onClose}
              style={{
                background: "#334155",
                color: "#fff",
                border: "none",
                padding: "12px 22px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: status === "Resolved" ? "#10b981" : "#06b6d4",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FaSave /> {saving ? "Submitting Resolution..." : status === "Resolved" ? "Save & Resolve Complaint" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ title, value, color, icon, subtitle }) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "16px",
        padding: "22px",
        borderLeft: `5px solid ${color}`,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
            {title}
          </div>
          <div style={{ fontSize: "30px", fontWeight: "bold", color: "#fff" }}>
            {value}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            {subtitle}
          </div>
        </div>
        <div style={{ fontSize: "36px", color: color }}>{icon}</div>
      </div>
    </div>
  );
}

// PROGRESS ROW COMPONENT FOR STATISTICS
function StatProgressRow({ label, count, total, color, icon }) {
  const percent = Math.round((count / total) * 100);

  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          fontSize: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon}
          <span>{label}</span>
        </div>
        <div>
          <b>{count}</b> <span style={{ color: "#94a3b8", fontSize: "12px" }}>({percent}%)</span>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#0f172a",
          borderRadius: "4px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: "4px",
            transition: "width 0.4s ease-in-out"
          }}
        />
      </div>
    </div>
  );
}

const cardSectionStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  border: "1px solid #334155"
};

const thStyle = {
  padding: "14px 12px",
  fontSize: "13px",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "14px 12px",
  fontSize: "13px"
};

const filterSelectStyle = {
  background: "#0f172a",
  color: "#fff",
  border: "1px solid #334155",
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "13px",
  outline: "none",
  cursor: "pointer"
};

const tableSelectStyle = {
  background: "#0f172a",
  color: "#fff",
  border: "1px solid #334155",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  outline: "none",
  cursor: "pointer"
};

export default AdminDashboard;
