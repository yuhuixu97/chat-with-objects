import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GeneratedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    imageUrl,
    objectName,
    objectDescription,
    objectStory,
    currentPrompt,
    newChat,
  } = location.state || {}; // 获取物品名称和图片

  /*const handleStartChat = () => {
    navigate(`/chat/${newChat.conversation_id}`, {
      state: {
        objectName: objectName,
        imageUrl: imageUrl,
        objectDescription: objectDescription,
        objectStory: objectStory,
        chosenPrompt: currentPrompt,
      },
    });
    console.log("Jumping to the new chat: ", newChat.conversation_id);
  };*/

  const handleStartChat = () => {
    // 返回至 ChatList
    navigate(`/`, {
      state: {
        objectName: objectName,
        imageUrl: imageUrl,
        objectDescription: objectDescription,
        objectStory: objectStory,
        chosenPrompt: currentPrompt,
        highlightId: newChat.conversation_id,
      },
    });
    console.log(
      "Returning to ChatList with the new chat: ",
      newChat.conversation_id
    );
  };

  return (
    <div className="story-page full-height" style={{ alignItems: "center" }}>
      <div className="nav-bar2"></div>
      {imageUrl ? (
        <div className="photo-page">
          <div className="photo-display-round" style={{ padding: "8px" }}>
            <img src={imageUrl} alt="Captured" />
          </div>
        </div>
      ) : (
        <p>No photo available.</p>
      )}
      <h1 className="storytext" style={{ paddingTop: "8px" }}>
        Generation completed.
      </h1>
      <h1
        className="storytext"
        style={{ fontSize: "20px", paddingBottom: "16px" }}
      >
        You can now chat with it!
      </h1>

      {/* Start the chat 按钮，点击跳转chatpage */}
      <div style={{ padding: "16px" }}>
        <button className="start-chat-btn" onClick={handleStartChat}>
          Back to list
        </button>
      </div>
    </div>
  );
}
