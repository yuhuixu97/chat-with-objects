import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";

export default function StoryInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt, pmtOption, objectEnvironment } =
    location.state || {}; // 从 `location.state` 获取传递的图片 URL
  const [objectName, setObjectName] = useState(""); // 存储用户输入的 objectName
  //const [objectDescription, setObjectDescription] = useState(""); // 存储物品描述
  const [objectDescription1, setObjectDescription1] = useState(""); // 存储物品描述
  const [objectDescription2, setObjectDescription2] = useState(""); // 存储物品描述
  const [objectStory, setObjectStory] = useState(""); // 存储物品选择原因
  const [objectMemory, setObjectMemory] = useState(""); // 存储物品相关记忆

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

    const combinedDescription = objectDescription1 + " " + objectDescription2;
    console.log("Combined objectDescription: ", combinedDescription);

    navigate("/GeneratingPage", {
      state: {
        imageUrl,
        objectName,
        objectDescription: combinedDescription,
        objectStory,
        objectMemory,
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
              objectName &&
              objectDescription1 &&
              objectDescription2 &&
              objectStory
                ? ""
                : "disabled"
            }`}
            onClick={handleDone}
            disabled={
              !(
                objectName &&
                objectDescription1 &&
                objectDescription2 &&
                objectStory
              )
            }
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
              style={{ width: "272px" }}
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
                paddingTop: "0px",
              }}
            >
              - Size, color, shape, material?
            </p>

            {/* 文本框部分 */}
            <textarea
              ref={textareaRef}
              className="descriptives-input"
              type="text"
              //placeholder="- Size, color, shape, function..."
              value={objectDescription1}
              onChange={(e) => setObjectDescription1(e.target.value)}
            />
            <p
              className="subtext"
              style={{
                paddingTop: "4px",
              }}
            >
              - Impressions, feelings?
            </p>
            <textarea
              ref={textareaRef}
              className="descriptives-input"
              type="text"
              //placeholder="- Size, color, shape, function..."
              value={objectDescription2}
              onChange={(e) => setObjectDescription2(e.target.value)}
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
            {/*<p
              className="subtext"
              style={{
                padding: "0px",
              }}
            >
              - Any shared experience with it?
            </p>*/}
            {/* 文本框部分 */}
            <p
              className="subtext"
              style={{
                paddingTop: "0px",
              }}
            >
              - A memory about it?
            </p>
            <textarea
              className="story-input"
              ref={textareaRef}
              type="text"
              /*placeholder={
              currentPrompt
                ? `- Your first memory with it?\n- Why "${currentPrompt}"?`
                : "What is your story with the object?"
            } // Why does the object "makes you feel happy"?*/
              value={objectMemory}
              onChange={(e) => setObjectMemory(e.target.value)}
            />
            <p
              className="subtext"
              style={{
                paddingTop: "4px",
                overflowWrap: "break-word",
              }}
            >
              {currentPrompt
                ? `- Why "${currentPrompt}"?`
                : "- What is your story with the object?"}
            </p>
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
