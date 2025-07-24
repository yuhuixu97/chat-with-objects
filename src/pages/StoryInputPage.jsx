import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";

export default function StoryInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt, pmtOption, objectEnvironment } =
    location.state || {}; // 从 `location.state` 获取传递的图片 URL
  const [objectName, setObjectName] = useState(""); // 存储用户输入的 objectName
  const [objectDescription, setObjectDescription] = useState(""); // 存储物品描述
  const [objectStory, setObjectStory] = useState(""); // 存储物品描述

  const textareaRef = useRef(null);

  console.log(
    "objectEnvironment passed to StoryInputPage from PhotoPage: ",
    objectEnvironment
  );

  // 弹出键盘时聚焦到textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleFocus = () => {
      setTimeout(() => {
        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    };
    textarea.addEventListener("focus", handleFocus);
    return () => textarea.removeEventListener("focus", handleFocus);
  }, []);

  const handleDone = async () => {
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
        objectEnvironment,
      },
    });
  };

  return (
    <div className="story-page-container">
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
            disabled={!(objectName && objectDescription && objectStory)}
          >
            Done
          </button>
        </div>
        <div className="story-input-area" style={{ paddingTop: "0" }}>
          {imageUrl ? (
            <div className="captured-photo-area">
              <div
                className="photo-display-round"
                style={{ boxShadow: "0 0 0 8px #fff" }}
              >
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
              ref={textareaRef}
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
                paddingBottom: "4px",
                paddingTop: "16px",
                fontWeight: "500",
              }}
            >
              How would you describe it?
            </p>
            <p
              className="subtext"
              style={{
                padding: "0px",
              }}
            >
              - Size, color, shape, function
            </p>
            <p
              className="subtext"
              style={{
                paddingTop: "0px",
                paddingBottom: "12px",
              }}
            >
              - Impressions, feelings
            </p>
            {/* 文本框部分 */}
            <textarea
              ref={textareaRef}
              className="descriptives-input"
              type="text"
              //placeholder="- Size, color, shape, function..."
              value={objectDescription}
              onChange={(e) => setObjectDescription(e.target.value)}
            />
          </div>
          <div style={{ width: "292px", marginBottom: "32px" }}>
            <p
              className="storytext"
              style={{
                paddingBottom: "4px",
                paddingTop: "12px",
                fontWeight: "500",
              }}
            >
              Tell me about this object 😊
            </p>
            <p
              className="subtext"
              style={{
                padding: "0px",
              }}
            >
              - First memory with it?
            </p>
            <p
              className="subtext"
              style={{
                paddingTop: "0px",
                paddingBottom: "12px",
                overflowWrap: "break-word",
              }}
            >
              {currentPrompt
                ? `- Why "${currentPrompt}"?`
                : "- What is your story with the object?"}
            </p>
            {/* 文本框部分 */}
            <textarea
              className="story-input"
              ref={textareaRef}
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
    </div>
  );
}
