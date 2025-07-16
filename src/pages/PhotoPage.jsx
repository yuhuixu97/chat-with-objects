import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// icons
import { GoChevronLeft } from "react-icons/go";

export default function PhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt, pmtOption } = location.state || {}; // 从 `location.state` 获取传递的图片 URL

  console.log("pmtOption in PhotoPage: ", pmtOption);

  return (
    <div
      className="camera-page full-height"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="nav-bar2" style={{ backgroundColor: "#f5f5f5" }}>
        <button
          className="back-btn"
          onClick={() =>
            navigate("/CameraPage", { state: { currentPrompt, pmtOption } })
          }
        >
          <GoChevronLeft size={24} />
        </button>
        <button
          className="done-btn"
          onClick={() =>
            navigate("/StoryInputPage", {
              state: { imageUrl, currentPrompt, pmtOption },
            })
          }
          style={{ paddingRight: "0" }}
        >
          Done
        </button>
      </div>

      <h3>Photo of the object</h3>

      {imageUrl ? (
        <div className="photo-display">
          <img src={imageUrl} alt="Captured" />
        </div>
      ) : (
        <p>No photo available.</p>
      )}
      <div>
        <p>{currentPrompt}</p>
      </div>
    </div>
  );
}
