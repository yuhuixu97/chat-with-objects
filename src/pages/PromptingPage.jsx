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
    "#ff7e5f", // 颜色1: 浅粉色
    "#feb47b", // 颜色2: 温暖的橙色 (加深了一些)
    "#00c6ff", // 颜色3: 天空蓝
    "#0072ff", // 颜色4: 深蓝色
    "#fcb69f", // 颜色5: 淡桃色 (加深了一些)
    "#d4a5a5", // 颜色6: 浅灰红色
    //"#56ab2f", // 颜色7: 草绿色
    "#a8e063", // 颜色8: 亮绿色 (加深了一些)
    "#2b5876", // 颜色9: 海蓝色
    "#4e4376", // 颜色10: 深紫色
    "#9d50bb", // 颜色11: 紫色
    "#6e48aa", // 颜色12: 深紫色
    "#FFC312", // 颜色13: 亮黄色 (加深了一些)
    "#12CBC4", // 颜色14: 清新蓝色
    "#FDA7DC", // 颜色15: 淡粉色 (加深了一些)
    "#F79C42", // 颜色16: 橙色
    //"#6a9e23", // 颜色17: 黄绿色
    "#ED4C67", // 颜色18: 鲜艳红色
    "#6F1E51", // 颜色19: 深紫色
    "#1B1464", // 颜色20: 深蓝色
    "#4B7BEC", // 颜色21: 明亮蓝色
    "#6F7DFF", // 颜色22: 淡紫色 (加深了一些)
    "#F8C291", // 颜色23: 温暖的杏色 (加深了一些)
  ];

  function setRandomTextGradient() {
    const random = bgColor[Math.floor(Math.random() * bgColor.length)];
    const element = document.querySelector(".prompt-area");
    element.style.background = random;
    // 设置与背景颜色相似的阴影颜色
    const shadowColor = random; // 使用相同的颜色作为阴影颜色
    /* 水平偏移、垂直偏移、模糊半径、阴影颜色 */
    element.style.boxShadow = `0px 12px 16px rgba(${parseInt(
      shadowColor.slice(1, 3),
      16
    )}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(
      shadowColor.slice(5, 7),
      16
    )}, 0.2)`;
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
            <p className="prompt-text">Pick an object that:</p>
          </div>

          <div
            className={`prompt-area ${isAnimating ? "pulse-animation" : ""}`}
          >
            <div className="prompt-highlight">{currentPrompt}</div>
          </div>

          <div className="prompting-page-block">
            <p className="prompt-subtext">and take a photo of it.</p>
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
