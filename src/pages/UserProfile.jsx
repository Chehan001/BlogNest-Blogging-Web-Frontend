// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    setError("");
    try {
      const { data } = await api.get("/blogs/my"); // ✅ backend needed
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      return setError("Title and content are required");
    }

    setSaving(true);
    try {
      const { data } = await api.post("/blogs", { title, content }); // ✅ backend needed
      const newPost = data.post;

      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setError("");
    try {
      await api.delete(`/blogs/${postId}`); // ✅ backend needed
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>User Profile</h2>
          <p style={{ margin: "6px 0", opacity: 0.8 }}>
            Logged in as: <b>{user?.email || "Unknown"}</b>
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            borderRadius: 10,
          }}
        >
          Log out
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            border: "1px solid #ffb4b4",
            background: "#ffecec",
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Add Post */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Add a Post</h3>
        <form onSubmit={handleAddPost} style={{ display: "grid", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            rows={5}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <button
            disabled={saving}
            type="submit"
            style={{
              padding: "10px 14px",
              border: "none",
              background: "black",
              color: "white",
              cursor: "pointer",
              borderRadius: 10,
              width: 160,
            }}
          >
            {saving ? "Saving..." : "Add Post"}
          </button>
        </form>
      </div>

      {/* My Posts */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>My Posts</h3>

        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No posts yet. Create one above.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {posts.map((p) => (
              <div
                key={p._id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: 0 }}>{p.title}</h4>
                  <button
                    onClick={() => handleDeletePost(p._id)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ffb4b4",
                      background: "#ffecec",
                      cursor: "pointer",
                      borderRadius: 10,
                    }}
                  >
                    Delete
                  </button>
                </div>
                <p style={{ margin: "10px 0 0", opacity: 0.85 }}>{p.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
