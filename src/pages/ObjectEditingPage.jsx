import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";

export default function ObjectEditingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversation_id } = location.state || {}; // 从 `location.state` 获取传递的图片 URL
  const [objectName, setObjectName] = useState(""); // 存储用户输入的 objectName
  const [objectStory, setObjectStory] = useState(""); // 存储物品描述
  const [objectDescription, setObjectDescription] = useState(""); // 存储物品描述

  const handleDone = () => {
    if (!objectName.trim()) {
      alert("Please enter the object's name.");
      return;
    }

    navigate("/GeneratingPage", {
      state: {
        imageUrl,
        objectName,
        objectDescription,
        objectStory,
        currentPrompt,
      },
    });
  };

  return (
    <div className="story-page full-height">
      <div className="nav-bar2">
        <button className="back-btn" onClick={() => navigate("/PromptingPage")}>
          <GoChevronLeft size={24} />
        </button>
        <button className="done-btn" onClick={handleDone}>
          Done
        </button>
      </div>
      <div className="story-input-area">
        {imageUrl ? (
          <div className="captured-photo-area">
            <div className="photo-display-round">
              <img src={imageUrl} alt="Captured" />
            </div>
          </div>
        ) : (
          <p>No photo available.</p>
        )}

        <div>
          <p className="storytext">What do you want to call it?</p>
          {/* 文本框部分 */}
          <input
            className="name-input"
            type="text"
            placeholder="Its name is..."
            rows="1"
            cols="32"
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
          />
        </div>
        <p className="storytext">How would you describe it?</p>
        {/* 文本框部分 */}
        <textarea
          className="descriptives-input"
          type="text"
          placeholder="Size, color, shape, function..."
          value={objectDescription}
          onChange={(e) => setObjectDescription(e.target.value)}
        />
        <p className="storytext">Lastly, tell me about this object 😊</p>
        {/* 文本框部分 */}
        <textarea
          className="story-input"
          type="text"
          placeholder="What's the story behind it?"
          value={objectStory}
          onChange={(e) => setObjectStory(e.target.value)}
        />
      </div>
    </div>
  );
}
