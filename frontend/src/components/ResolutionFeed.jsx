import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaHeart,
  FaPlusCircle,
  FaTimes,
  FaSync,
  FaTrashAlt,
  FaRoad,
  FaTint
} from "react-icons/fa";

const API_BASE_URL = "http://127.0.0.1:5000";

function ResolutionFeed({ userRole }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Language state & event listener
  const [language, setLanguage] = useState(
    localStorage.getItem("civiceye_language") || "English"
  );
  const kannada = language === "Kannada";

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("civiceye_language") || "English");
    };
    window.addEventListener("civiceye-language-change", handleLanguageChange);
    return () => {
      window.removeEventListener("civiceye-language-change", handleLanguageChange);
    };
  }, []);

  // Admin New Post Form state
  const [adminName, setAdminName] = useState("Shimoga Municipal Corporation");
  const [title, setTitle] = useState("🕳️ Pothole Resolved");
  const [issueType, setIssueType] = useState("Pothole");
  const [location, setLocation] = useState("Shimoga Ward 14");
  const [problemDesc, setProblemDesc] = useState("Large pothole reported by citizens.");
  const [resolutionDesc, setResolutionDesc] = useState("Road repair completed by municipality.");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [archivePostConfirmItem, setArchivePostConfirmItem] = useState(null);

  const handleArchivePost = async (postId) => {
    try {
      const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";
      const res = await fetch(`${API_BASE_URL}/api/admin/feed/posts/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setArchivePostConfirmItem(null);
        fetchFeedPosts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to archive resolution post.");
      }
    } catch (err) {
      console.error("Error archiving resolution post:", err);
    }
  };

  const fetchFeedPosts = async () => {
    try {
      setRefreshing(true);
      const userObj = JSON.parse(localStorage.getItem("civiceye-user") || "{}");
      const userEmail = userObj.email || "citizen@civiceye.com";

      const res = await fetch(`${API_BASE_URL}/api/feed?user_email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch resolution feed posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  const handleLikeToggle = async (postId) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("civiceye-user") || "{}");
      const userEmail = userObj.email || "citizen@civiceye.com";

      const res = await fetch(`${API_BASE_URL}/api/feed/${postId}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail })
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes: data.likes, user_liked: data.liked }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const adminToken = sessionStorage.getItem("civiceye_admin_token") || "civiceye-admin-secret-token-2026";
      const formData = new FormData();
      formData.append("admin_name", adminName);
      formData.append("title", title);
      formData.append("issue_type", issueType);
      formData.append("location", location);
      formData.append("problem_description", problemDesc);
      formData.append("resolution_description", resolutionDesc);
      if (postImage) {
        formData.append("resolution_image", postImage);
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/feed/post`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        },
        body: formData
      });

      if (res.ok) {
        setShowCreateModal(false);
        setPostImage(null);
        setImagePreview("");
        fetchFeedPosts();
      } else {
        alert("Failed to publish resolution feed post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Network error publishing post.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for issue icon
  const getIssueIcon = (issue) => {
    const iss = (issue || "").toLowerCase();
    if (iss.includes("garbage")) return <FaTrashAlt color="#ef4444" />;
    if (iss.includes("pothole")) return <FaRoad color="#f59e0b" />;
    if (iss.includes("water")) return <FaTint color="#06b6d4" />;
    return <FaCheckCircle color="#10b981" />;
  };

  return (
    <div
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "20px 15px",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* FEED HEADER & NAVIGATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          background: "#1e293b",
          padding: "20px 25px",
          borderRadius: "16px",
          border: "1px solid #334155",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#38bdf8", fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            {kannada ? "📢 ಮಹಾನಗರ ಪಾಲಿಕೆ ನವೀಕರಣಗಳು" : "📢 Municipality Updates"}
          </h2>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            {kannada ? "ನಗರಸಭೆಯ ಪೂರ್ಣಗೊಂಡ ಕಾಮಗಾರಿಗಳ ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ" : "Public feed of completed municipal works & resolution achievements"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {userRole === "admin" && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FaPlusCircle /> {kannada ? "ಹೊಸ ನವೀಕರಣ ಪ್ರಕಟಿಸಿ" : "Create Update Post"}
            </button>
          )}

          <button
            onClick={fetchFeedPosts}
            disabled={refreshing}
            style={{
              background: "#0f172a",
              color: "#06b6d4",
              border: "1px solid #06b6d4",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaSync className={refreshing ? "fa-spin" : ""} />
            {kannada ? "ಸಿಂಕ್" : "Sync"}
          </button>
        </div>
      </div>

      {/* FEED POSTS LIST */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#38bdf8" }}>
          {kannada ? "ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ..." : "Loading resolution feed updates..."}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          {kannada ? "ಯಾವುದೇ ನವೀಕರಣಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No resolution posts published yet."}
        </div>
      ) : (
        posts.map((post) => {
          // Image URL formatting
          let imageSrc = null;
          if (post.resolution_image) {
            if (post.resolution_image.startsWith("http")) {
              imageSrc = post.resolution_image;
            } else if (post.resolution_image.startsWith("result/")) {
              imageSrc = `${API_BASE_URL}/prediction/${post.resolution_image.replace("result/", "")}`;
            } else {
              imageSrc = `${API_BASE_URL}/uploads/${post.resolution_image}`;
            }
          }

          return (
            <div
              key={post.id}
              style={{
                background: "#1e293b",
                borderRadius: "20px",
                border: "1px solid #334155",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
                marginBottom: "25px",
                overflow: "hidden"
              }}
            >
              {/* POST HEADER */}
              <div
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #334155"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "20px"
                    }}
                  >
                    🏛️
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                      {post.admin_name || "Shimoga Municipal Corporation"}
                    </h4>
                    <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FaCalendarAlt size={10} /> {kannada ? "ಪರಿಹಾರ ದಿನಾಂಕ: " : "Resolution Date: "} {post.resolution_date || post.created_at}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <FaCheckCircle /> {kannada ? "✅ ಪರಿಹರಿಸಲಾಗಿದೆ" : "✅ RESOLVED"}
                </div>
              </div>

              {/* POST CONTENT BODY */}
              <div style={{ padding: "22px" }}>
                {/* LOCATION & TITLE */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#ef4444",
                      background: "#0f172a",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginBottom: "8px"
                    }}
                  >
                    <FaMapMarkerAlt /> {kannada ? "📍 ಸ್ಥಳ: " : "📍 Location: "} {post.location || "Shimoga"}
                  </div>

                  <h3 style={{ margin: "4px 0", color: "#38bdf8", fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {getIssueIcon(post.issue_type)} {post.title || "Public Issue Resolved"}
                  </h3>
                </div>

                {/* RESOLUTION PHOTO EVIDENCE */}
                {imageSrc && (
                  <div style={{ margin: "16px 0", borderRadius: "14px", overflow: "hidden", border: "2px solid #334155" }}>
                    <img
                      src={imageSrc}
                      alt="Resolution Proof"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                      style={{
                        width: "100%",
                        maxHeight: "360px",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </div>
                )}

                {/* PROBLEM DESCRIPTION BOX */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    borderLeft: "4px solid #f59e0b"
                  }}
                >
                  <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "13px", marginBottom: "4px" }}>
                    {kannada ? "ಸಮಸ್ಯೆ:" : "Problem:"}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>
                    {post.problem_description || "Large pothole reported by citizens."}
                  </div>
                </div>

                {/* ACTION TAKEN / RESOLUTION DESCRIPTION BOX */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #064e3b, #0f172a)",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    borderLeft: "4px solid #10b981"
                  }}
                >
                  <div style={{ color: "#34d399", fontWeight: "bold", fontSize: "13px", marginBottom: "4px" }}>
                    {kannada ? "ತೆಗೆದುಕೊಂಡ ಕ್ರಮ:" : "Action Taken:"}
                  </div>
                  <div style={{ color: "#fff", fontSize: "14px", lineHeight: "1.5", fontWeight: "500" }}>
                    {post.resolution_description || "Road repair completed by municipality."}
                  </div>
                </div>
              </div>

              {/* POST FOOTER (SOCIAL INTERACTIONS) */}
              <div
                style={{
                  padding: "14px 22px",
                  background: "#0f172a",
                  borderTop: "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <button
                  onClick={() => handleLikeToggle(post.id)}
                  style={{
                    background: post.user_liked ? "#ec4899" : "#334155",
                    color: "#fff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "0.2s"
                  }}
                >
                  <FaHeart color={post.user_liked ? "#fff" : "#ec4899"} />
                  {post.user_liked
                    ? (kannada ? `💖 ಇಷ್ಟಪಟ್ಟಿದ್ದಾರೆ (${post.likes || 0})` : `💖 Liked (${post.likes || 0})`)
                    : (kannada ? `🤍 ಅಭಿನಂದಿಸಿ (${post.likes || 0})` : `🤍 Applaud (${post.likes || 0})`)}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {userRole === "admin" && (
                    <button
                      onClick={() => setArchivePostConfirmItem(post)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "14px",
                        fontWeight: "bold",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <FaTrashAlt /> Archive Post
                    </button>
                  )}

                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                    {kannada ? "ಅಧಿಕೃತ ಸಿವಿಕ್ ಐ ನವೀಕರಣ ವರದಿ" : "Official CivicEye Resolution Report"}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* ADMIN CONFIRMATION DIALOG FOR ARCHIVING FEED POST */}
      {archivePostConfirmItem && (
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
              📦 Archive Resolution Post?
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              Are you sure you want to archive post "{archivePostConfirmItem.title}"? It will be hidden from the public feed while preserving all likes and records safely.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => setArchivePostConfirmItem(null)}
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
                onClick={() => handleArchivePost(archivePostConfirmItem.id)}
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

      {/* ADMIN CREATE POST MODAL */}
      {showCreateModal && (
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
              maxWidth: "600px",
              borderRadius: "20px",
              border: "2px solid #10b981",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              padding: "25px",
              color: "#fff",
              position: "relative"
            }}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <FaTimes />
            </button>

            <h3 style={{ margin: "0 0 15px", color: "#34d399" }}>
              📢 Publish Municipality Resolution Update
            </h3>

            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  Municipality / Authority Name:
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                    Resolution Title:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                    Issue Type:
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Water Leakage">Water Leakage</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  Location:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Shimoga"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  Problem Description:
                </label>
                <textarea
                  rows="2"
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  placeholder="Problem: Large pothole reported by citizens."
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  Action Taken / Resolution Description:
                </label>
                <textarea
                  rows="2"
                  value={resolutionDesc}
                  onChange={(e) => setResolutionDesc(e.target.value)}
                  placeholder="Action Taken: Road repair completed by municipality."
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  Resolution Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={inputStyle}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: "100px", marginTop: "8px", borderRadius: "8px" }}
                  />
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: "#334155",
                    color: "#fff",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {submitting ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "#0f172a",
  color: "#fff",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "10px",
  fontSize: "13px",
  outline: "none"
};

export default ResolutionFeed;
