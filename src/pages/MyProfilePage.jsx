import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  userDataModel,
  addConversation,
  initializeUser,
} from "../userDataModel";
import { getResourceId } from "../resource"; // 导入设置方法

import { GoPlus } from "react-icons/go";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";

let resource_id = "";

export default function MyProfilePage() {
  const [userAvatar, setUserAvatar] = useState(null);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const isList = location.pathname === "/";
  const isUser = location.pathname === "/MyProfilePage";

  useEffect(() => {
    resource_id = getResourceId(); // 页面加载时获取 resource_id
    console.log("Resource_id set: ", resource_id);
    // 页面加载时执行
    getUserData();
  }, []); // 空依赖数组表示只在组件首次挂载时运行一次

  const getUserData = (callback) => {
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
        resource_id: resource_id,
        token: "token_for_identifier",
      },
      type: "GET",
      contentType: "application/json",
      success: function (data) {
        console.log("Fetched user data:", data);
        // 假设 API 返回的数据格式如下：
        // { conversations: [{ conversation_id: "123", object_name: "Cup", avatar_url: "..." }, {...}] }
        if (data.conversations) {
          userDataModel.conversations = data.conversations;
          console.log("userDataModel: ", userDataModel);
          //callback(userDataModel.conversations);
        }
        setUserAvatar(data.user_avatar_url);
        console.log("userAvatar fetched: ", data.user_avatar_url);
      },
      error: function (e) {
        console.log("Error fetching data:", e);
      },
    });
  };

  // 点击add chat button后的动画
  const handleButtonClick = () => {
    setClicked(true); // 添加动画 class
    setTimeout(() => {
      navigate("/SelectingPage");
    }, 450); // 跳转延迟，和动画匹配
  };

  const handleLogout = () => {
    // 这里写退出逻辑，比如清除 token 或跳转登录页
    navigate("/LoginPage");
    console.log("User logged out");
  };

  return (
    <div className="chat-list-container full-height">
      {/* 顶部导航栏 */}
      <nav className="navbar">
        <h2 className="chat-list-title">My profile</h2>
      </nav>

      {/* 聊天列表 */}
      <div className="my-profile-page">
        <div
          className="my-profile-photo"
          style={{ padding: "8px", marginTop: "16px" }}
        >
          <img src={userAvatar} alt="Captured" />
        </div>
        <button
          className="my-profile-btn-avatar"
          onClick={() => navigate("/AvatarSelectionPage")}
          style={{ marginBottom: "24px" }}
        >
          Change avatar
        </button>
        <button
          className="my-profile-btn-note"
          onClick={() =>
            navigate("/NotePage", { state: { resource_id: resource_id } })
          }
        >
          <AiFillEdit style={{ marginRight: "8px" }} />
          Send note
        </button>
        <button
          className="my-profile-btn-logout"
          onClick={() => setShowConfirm(true)}
        >
          Log out
        </button>
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p style={{ marginTop: "8px", marginBottom: "24px" }}>
              Are you sure to log out?
            </p>
            <div className="modal-buttons">
              <button onClick={handleLogout}>Log out</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-navbar">
        {/* 固定底部的 New Chat 按钮 */}
        <div className="bottom-nav-item" onClick={() => navigate("/")}>
          <AiOutlineUnorderedList
            size={24}
            color={isList ? "orange" : "black"}
          />
        </div>
        <div className="bottom-nav-item">
          <button
            className={`add-chat-btn ${clicked ? "clicked" : ""}`}
            onClick={handleButtonClick}
          >
            <GoPlus size={32} />
          </button>
        </div>
        <div
          className="bottom-nav-item"
          onClick={() => navigate("/MyProfilePage")}
        >
          <AiOutlineUser size={24} color={isUser ? "orange" : "black"} />
        </div>
      </div>
    </div>
  );
}
