import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// icons
import { GoChevronLeft } from "react-icons/go";

export default function PhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt } = location.state || {}; // 从 `location.state` 获取传递的图片 URL

  return (
    <div className="camera-page full-height">
      <div className="nav-bar2" style={{ backgroundColor: "#1a1a1a" }}>
        <button className="back-btn" onClick={() => navigate("/CameraPage")}>
          <GoChevronLeft size={24} style={{ color: "#ffffff" }} />
        </button>
        <button
          className="done-btn"
          onClick={() =>
            navigate("/StoryInputPage", { state: { imageUrl, currentPrompt } })
          }
          style={{ color: "#ffffff" }}
        >
          Done
        </button>
      </div>

      <h2 style={{ color: "#ffffff" }}>Your Photo</h2>

      {imageUrl ? (
        <div className="photo-display">
          <img src={imageUrl} alt="Captured" />
        </div>
      ) : (
        <p>No photo available.</p>
      )}
    </div>
  );
}
