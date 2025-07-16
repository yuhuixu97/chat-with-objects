import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// icons
import { GoChevronLeft } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { FcIdea } from "react-icons/fc";

export default function SelectingPage() {
  const navigate = useNavigate();
  return (
    <div className="chat-container full-height">
      <div className="chat-page">
        {/*<div className="prompting-container">*/}
        {/* 返回按钮 */}
        <nav className="nav-bar2">
          <button className="back-btn" onClick={() => navigate("/")}>
            <AiOutlineClose size={20} />
          </button>
        </nav>

        <div className="main-area">
          <div style={{ width: "100%", height: "56px" }}></div>
          <button
            className="selection-btn"
            onClick={() => {
              setTimeout(() => {
                navigate("/PromptingPage", {
                  state: { prompt: "", pmtOption: "yesPrompt" },
                }); // 传递一个空字符串
              }, 250); // 延迟 300 毫秒跳转
            }}
          >
            <FcIdea size={64} style={{ marginBottom: "10px" }} />
            <span>Looking for an object to chat with?</span>
          </button>
          <button
            className="selection-btn-2"
            onClick={() => {
              setTimeout(() => {
                navigate("/CameraPage", { state: { pmtOption: "noPrompt" } });
              }, 250); // 延迟 300 毫秒跳转
            }}
          >
            I have an object in mind
          </button>
        </div>
      </div>
    </div>
  );
}
