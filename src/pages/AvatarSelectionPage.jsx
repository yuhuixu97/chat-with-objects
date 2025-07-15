import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../userDataModel";
import $ from "jquery";
import { getResourceId } from "../resource"; // 导入设置方法

// icons
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { GoChevronLeft } from "react-icons/go";

//let resource_id = "uac633de71b774f31";
const api_key = "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";
const url = `https://data.id.tue.nl/datasets/entity/14395/item/`;
const token = "token_for_identifier";

const avatarSeeds = [
  "cactus",
  "mochi",
  "luna",
  "blip",
  "pumpkin",
  "waffle",
  "biscuit",
  "kiwi",
  "oreo",
  "yuki",
  "zebra",
  "tofu",
  "pixel",
  "spacecat",
  "moonlight",
  "jellybean",
  "nova",
  "ruby",
  "matcha",
  "sunny",
];

export default function AvatarSelectionPage() {
  const [selectedAvatar, setSelectedAvatar] = useState("mochi");
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resource_id, setResourceId] = useState(""); // 设置resource_id

  useEffect(() => {
    const id = getResourceId(); // 页面加载时获取 resource_id
    setResourceId(id);
    console.log("Resource_id set: ", id);
  }, []);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar); // 更新选择的头像
    console.log("Selected Avatar:", avatar); // 可以打印到控制台，或者处理选择逻辑
  };

  // 点击完成时，弹窗并传递选择的头像
  const handleDoneClick = () => {
    if (selectedAvatar) {
      setShowConfirmation(true); // 弹窗
      updateUserAvatar(resource_id); //
      setTimeout(() => {
        navigate("/MyProfilePage", { state: { avatar: selectedAvatar } });
      }, 2000); // 延迟自动跳转
    } else {
      alert("Please select an avatar first!");
    }
  };

  // 把选定的avatar url发送到user data里
  const updateUserAvatar = (userId, callback) => {
    fetchUserData(userId, (fetchedUserData) => {
      if (!fetchedUserData) {
        console.log("No fetched user data");
        return;
      }

      $.ajax({
        url: url,
        headers: {
          api_token: api_key,
          resource_id: resource_id,
          token: token,
        },
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          user_avatar_url: `https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedAvatar}`, // 只发送新 user avatar
        }),
        success: function (response) {
          console.log("New avatar updated in user data", selectedAvatar);
          if (callback) callback(); // 如果有回调，确保继续执行后续逻辑
        },
        error: function (err) {
          console.error("Error updating user conversations", fetchedUserData);
        },
      });
    });
  };

  return (
    <div className="chat-container full-height">
      <div className="chat-page">
        <div className="navbar">
          <button
            className="back-btn"
            onClick={() => navigate("/MyProfilePage")}
          >
            <GoChevronLeft size={24} />
          </button>
          <header className="chat-header">Select your avatar</header>
          {selectedAvatar && (
            <button onClick={handleDoneClick} className="done-btn">
              Done
            </button>
          )}
          {/* 弹窗 */}
          {showConfirmation && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Your avatar is set!</h3>
                <img
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedAvatar}`}
                  alt="Selected Avatar"
                  className="modal-avatar"
                />
                <p style={{ fontSize: "14px" }}>Jumping to the next page...</p>
              </div>
            </div>
          )}
        </div>
        <div className="avatar-grid">
          {avatarSeeds.map((seed) => {
            const avatar = createAvatar(adventurer, {
              seed,
              size: 60, // 你也可以加 style、scale 等
            });
            const svg = avatar.toString(); // 返回的是 SVG 字符串

            return (
              <div
                key={seed}
                onClick={() => handleAvatarClick(seed)} // 点击头像时触发
                className={`avatar-item ${
                  selectedAvatar === seed ? "selected" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            );
          })}
        </div>
        <div className="footer">
          <p>Adventurer by Lisa Wischofsky / CC BY 4.0.</p>
        </div>
      </div>
    </div>
  );
}
