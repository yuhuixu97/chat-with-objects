import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addConversation } from "../userDataModel";
import getImagetoText from "../getImagetoText";

import {
  objectTraitsSpeculator,
  objectBehaviorSpeculator,
} from "../objectIdentitySpeculator";

export default function GeneratingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    imageUrl,
    objectName,
    objectDescription,
    objectStory,
    objectMemory,
    currentPrompt,
    objectEnvironment,
  } = location.state || {}; // 获取物品名称和图片

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNewChat(); // 替换成你想跳转的路径
    }, 4000); // 4000ms = 4秒
    console.log(
      "objectEnvironment passed to GeneratingPage from StoryInputPage: ",
      objectEnvironment
    );

    return () => clearTimeout(timer); // 清理定时器
  }, [navigate]);

  // 处理新对话
  //const handleStartChat = () => {
  const handleNewChat = async () => {
    // 获取 localAI photo-to-text 返回文本
    //const photoToText = await getImagetoText(imageUrl);

    // 处理生成 object traits 和 behaviors
    const traits = await objectTraitsSpeculator(objectDescription, objectStory);
    const behaviors = await objectBehaviorSpeculator(
      objectDescription,
      objectStory
    );

    try {
      const newChat = await addConversation(
        objectName,
        imageUrl,
        objectDescription,
        objectStory,
        objectMemory,
        currentPrompt,
        objectEnvironment,
        traits,
        behaviors
        //photoToText
      ); // ✅ 确保 `await` 结果

      if (newChat && newChat.conversation_id) {
        console.log("New chat created:", newChat);
        navigate("/GeneratedPage", {
          state: {
            imageUrl,
            //objectName,
            //objectDescription,
            //objectStory,
            //photoToText,
            //currentPrompt,
            newChat,
            //objectEnvironment,
          },
        });
      } else {
        console.error(
          "Failed to create new chat, conversation_id is undefined",
          newChat
        );
      }
    } catch (error) {
      console.error("Error while starting chat:", error);
    }

    /*
    const newChat = addConversation(objectName, imageUrl);
    console.log("newChat: ", newChat);

    if (newChat && newChat.conversation_id) {
      // make sure newChat.conversation_id exists
      /*navigate(`/chat/${newChat.conversation_id}`, {
        state: { imageUrl, objectName },
      });
      navigate("/", { state: { imageUrl, objectName } });
    } else {
      console.log(newChat, newChat.conversation_id);
      console.error("Failed to create new chat, ID is undefined");
    }*/
  };

  return (
    <div className="story-page full-height">
      <div className="nav-bar2">
        {/*<button className="back-btn" onClick={() => navigate("/")}>
          Cancel
        </button>*/}
      </div>
      <div className="generate-page">
        {imageUrl ? (
          <div
            className="photo-page"
            style={{ paddingTop: "24px", paddingBottom: "24px" }}
          >
            <div
              className="photo-display-round"
              style={{
                boxShadow: "0 0 0 8px #fff",
                width: "180px",
                height: "180px",
              }}
            >
              <img src={imageUrl} alt="Captured" />
            </div>
          </div>
        ) : (
          <p>No photo available.</p>
        )}
        <h1
          className="storytext"
          style={{ padding: "8px", paddingBottom: "32px" }}
        >
          Generating a chat with it ...
        </h1>
        <div className="dot-loader">
          <span className="dot" style={{ animationDelay: "0s" }}></span>
          <span className="dot" style={{ animationDelay: "0.2s" }}></span>
          <span className="dot" style={{ animationDelay: "0.4s" }}></span>
          <span className="dot" style={{ animationDelay: "0.6s" }}></span>
          <span className="dot" style={{ animationDelay: "0.8s" }}></span>
        </div>
        {/* AI photo-to-text 返回文本容器（result-container-photo-to-text） */}
        <div
          id="result-container-photo-to-text"
          style={{ display: "none" }}
        ></div>
        {/* AI 返回文本容器（result-container-objectTraits） */}
        <div
          id="result-container-objectTraits"
          style={{ display: "none" }}
        ></div>
        {/* AI 返回文本容器（result-container-objectBehaviors） */}
        <div
          id="result-container-objectBehaviors"
          style={{ display: "none" }}
        ></div>
      </div>
    </div>
  );
}
