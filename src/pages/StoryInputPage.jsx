import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";

export default function StoryInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt, pmtOption } = location.state || {}; // 从 `location.state` 获取传递的图片 URL
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
        <button
          className="back-btn"
          onClick={() =>
            navigate("/CameraPage", { state: { currentPrompt, pmtOption } })
          }
        >
          <GoChevronLeft size={24} />
        </button>
        <button
          className={`done-btn ${
            objectName && objectDescription && objectStory ? "" : "disabled"
          }`}
          onClick={handleDone}
          style={{ paddingRight: "0" }}
          disabled={!(objectName && objectDescription && objectStory)}
        >
          Done
        </button>
      </div>
      <div className="story-input-area" style={{ paddingTop: "0" }}>
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
          <p
            className="storytext"
            style={{ justifySelf: "left", fontWeight: "500" }}
          >
            What do you want to call it?
          </p>
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
        <div>
          <p
            className="storytext"
            style={{
              justifySelf: "left",
              paddingBottom: "2px",
              paddingTop: "12px",
              fontWeight: "500",
            }}
          >
            How would you describe it?
          </p>
          <p
            className="storytext"
            style={{
              fontSize: "13px",
              color: "#666",
              padding: "0px",
              justifySelf: "left",
            }}
          >
            - Size, color, shape, function
          </p>
          <p
            className="storytext"
            style={{
              fontSize: "13px",
              color: "#666",
              paddingTop: "0px",
              justifySelf: "left",
            }}
          >
            - Impressions, feelings
          </p>
          {/* 文本框部分 */}
          <textarea
            className="descriptives-input"
            type="text"
            //placeholder="- Size, color, shape, function..."
            value={objectDescription}
            style={{ minHeight: "64px" }}
            onChange={(e) => setObjectDescription(e.target.value)}
          />
        </div>
        <div>
          <p
            className="storytext"
            style={{
              justifySelf: "left",
              paddingBottom: "2px",
              paddingTop: "6px",
              fontWeight: "500",
            }}
          >
            Lastly, tell me about this object 😊
          </p>
          <p
            className="storytext"
            style={{
              fontSize: "13px",
              color: "#666",
              padding: "0px",
              justifySelf: "left",
            }}
          >
            - First memory with it?
          </p>
          <p
            className="storytext"
            style={{
              fontSize: "13px",
              color: "#666",
              paddingTop: "0px",
              justifySelf: "left",
              overflowWrap: "break-word",
              width: "252px",
            }}
          >
            {currentPrompt
              ? `- Why "${currentPrompt}"?`
              : "- What is your story with the object?"}
          </p>
          {/* 文本框部分 */}
          <textarea
            className="story-input"
            type="text"
            /*placeholder={
              currentPrompt
                ? `- Your first memory with it?\n- Why "${currentPrompt}"?`
                : "What is your story with the object?"
            } // Why does the object "makes you feel happy"?*/
            value={objectStory}
            onChange={(e) => setObjectStory(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
