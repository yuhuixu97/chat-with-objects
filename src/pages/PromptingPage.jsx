import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  prompts_SnO_past,
  prompts_SnO_present,
  prompts_SnO_future,
  prompts_SnOnO_past,
  prompts_SnOnO_present,
  prompts_SnOnO_future,
} from "../objectPickingPrompts";

//import "./PromptingPage.css"; // 引入样式
// icons
import { GoChevronLeft } from "react-icons/go";
import { AiOutlineReload } from "react-icons/ai";
import { AiOutlineCamera } from "react-icons/ai";

// 定义提示文本数组
const prompts = [
  "Makes you happy",
  "Brings you joy",
  "Makes you feel calm",
  "Makes you feel inspired",
  "Reminds you of something special",
  "Makes you feel nostalgic",
  "Brings back good memories",
];

export default function PromptingPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const { prompt, pmtOption } = location.state; // 获取传递的 prompt
  const [currentPrompt, setPrompt] = useState(prompt || "Makes you happy");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log("Prompt changed to:", currentPrompt);
  }, [currentPrompt]);

  useEffect(() => {
    regeneratePrompt();
    setRandomTextGradient();
  }, []);

  const handleClick = () => {
    // 执行动画
    setIsAnimating(true);

    // 调用你的逻辑函数
    regeneratePrompt();

    setRandomTextGradient();

    // 动画结束后移除动画类
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // 要和 CSS 动画时间对应
  };

  // 生成一个随机的提示文本
  /*const regeneratePrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[randomIndex]); // 如果传递过来的 prompt 是空字符串，生成随机提示
    //console.log("Current prompt: ", currentPrompt);
  };*/

  const allPromptGroups = [
    prompts_SnO_past,
    prompts_SnO_present,
    prompts_SnO_future,
    prompts_SnOnO_past,
    prompts_SnOnO_present,
    prompts_SnOnO_future,
  ];

  const regeneratePrompt = () => {
    let newPrompt = currentPrompt;
    while (newPrompt === currentPrompt) {
      // 随机选一个数组
      const randomGroupIndex = Math.floor(
        Math.random() * allPromptGroups.length
      );
      const chosenGroup = allPromptGroups[randomGroupIndex];
      // 从该数组中随机选一个元素
      const randomPromptIndex = Math.floor(Math.random() * chosenGroup.length);
      newPrompt = chosenGroup[randomPromptIndex];
    }
    setPrompt(newPrompt);
  };

  const bgColor = [
    "#e07a63", // 柔粉 → 加深
    "#e29362", // 柔橙 → 加深
    "#62b0cf", // 雾蓝 → 加深
    "#4a7bb8", // 柔蓝 → 略加深
    "#d49a87", // 杏粉 → 加深
    "#b39a9a", // 柔灰红 → 稍暗
    "#a4c47a", // 柔黄绿 → 稍暗
    "#4e657a", // 柔灰蓝 → 稍暗
    "#5b4e71", // 雾紫 → 加深
    "#84638f", // 柔紫 → 稍深
    "#73608b", // 暗紫灰 → 稍深
    "#d9b358", // 柔黄 → 加深
    "#72bcb9", // 雾青 → 稍深
    "#e69abc", // 淡藕粉 → 加深
    "#cc7e4e", // 柔橘棕 → 加深
    "#c05a6d", // 柔莓红 → 稍深
    "#6d4c67", // 柔紫灰 → 稍深
    "#3d416e", // 静蓝灰 → 稍深
    "#6880c7", // 柔蓝紫 → 加深
    "#7d88c9", // 雾淡紫 → 稍深
    "#daae90", // 柔暖杏 → 加深
  ];

  function setRandomTextGradient() {
    const random = bgColor[Math.floor(Math.random() * bgColor.length)];
    const element = document.querySelector(".prompt-area");
    element.style.background = random;
    // 设置与背景颜色相似的阴影颜色
    const shadowColor = random; // 使用相同的颜色作为阴影颜色
    /* 水平偏移、垂直偏移、模糊半径、阴影颜色 */
    element.style.boxShadow = `0px 64px 52px -30px rgba(${parseInt(
      shadowColor.slice(1, 3),
      16
    )}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(
      shadowColor.slice(5, 7),
      16
    )}, 0.4)`;
  }

  return (
    <div className="chat-container full-height">
      <div className="chat-page">
        {/*<div className="prompting-container">*/}
        {/* 返回按钮 */}
        <nav className="nav-bar2">
          <button
            className="back-btn"
            onClick={() => navigate("/SelectingPage")}
          >
            <GoChevronLeft size={24} />
          </button>
        </nav>

        <div className="main-area">
          <div className="prompting-page-block">
            <p className="prompt-text">Find an object that:</p>
          </div>

          <div
            className={`prompt-area ${isAnimating ? "pulse-animation" : ""}`}
          >
            <div className="overlay-mask" />
            <div className="prompt-highlight-text">{currentPrompt}</div>
          </div>

          <div className="prompting-page-block">
            <p className="prompt-text">and take a photo of it.</p>
          </div>

          <div className="prompting-btn-area">
            <button
              className="prompting-camera-btn"
              onClick={() =>
                navigate("/CameraPage", {
                  state: { currentPrompt, pmtOption: "yesPrompt" },
                })
              }
            >
              <AiOutlineCamera size={34} color="#ffffff" />
            </button>
            <button
              className="prompting-regenerate-btn"
              onClick={handleClick} // 执行原来的 regeneratePrompt 函数
            >
              <AiOutlineReload size={32} opacity={0.8} />
            </button>
          </div>
        </div>
        {/*</div>*/}
      </div>
    </div>
  );
}
