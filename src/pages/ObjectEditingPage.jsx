import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import $ from "jquery";
import {
  userDataModel,
  addConversation,
  initializeUser,
} from "../userDataModel";

import { getResourceId } from "../resource"; // 导入设置方法

let resource_id = "";
const api_key = "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";

// fetch user data and conversations
const getUserData = (callback) => {
  $.ajax({
    url: "https://data.id.tue.nl/datasets/entity/14395/item/",
    headers: {
      api_token: "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
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
        callback(userDataModel.conversations);
        console.log("userDataModel: ", userDataModel);
      }
    },
    error: function (e) {
      console.error("Error fetching data:", e);
    },
  });
};

export default function ObjectEditingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [objectChat, setObjectChat] = useState();
  const { conversation_id } = location.state || {}; // 从 ChatPage 获得 conversation_id
  const [objectPhoto, setObjectPhoto] = useState(""); // 存储 objectPhoto url
  const [objectName, setObjectName] = useState(""); // 存储用户输入的 objectName
  const [objectStory, setObjectStory] = useState(""); // 存储物品故事
  const [objectDescription, setObjectDescription] = useState(""); // 存储物品描述
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userChat, setUserChats] = useState([...userDataModel.conversations]); // 存储 user 下的 conversations
  const [currentPrompt, setCurrentPrompt] = useState("");

  useEffect(() => {
    resource_id = getResourceId();
    console.log("resource_id: ", resource_id);
    //const id = getResourceId();
    //setResourceId(id);
    //console.log("resource_id: ", id);
  }, []);

  useEffect(() => {
    if (!conversation_id) {
      alert("Conversation not found: ", conversation_id);
      navigate("/");
      return;
    }
    console.log("Conversation_id: " + conversation_id);

    getUserData((conversations) => {
      setUserChats(conversations); // 更新聊天列表，这是 user 层面的 conversations
      console.log("All user chats set: ", userChat); // 此处userChat打印出来为空，是因为异步更新没来得及，后面会更新的。
    });
    getChatData(conversation_id); // 通过 id 获取聊天数据
    console.log("Getting chat data...");
  }, [conversation_id]); // 当 id 变化时，重新加载数据

  const getChatData = (conversationId) => {
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
        resource_id: conversation_id, // the current chat
        token: "token_for_identifier",
      },
      type: "GET",
      contentType: "application/json",
      success: function (chat) {
        console.log("Chat data retrieved: ", chat);
        if (chat) {
          setObjectChat(chat);
          console.log("objectChat: ", objectChat);
          setObjectName(chat.object_name); // 获取并设置 object name
          setObjectPhoto(chat.avatar_url); // 获取并设置 imageUrl
          setObjectDescription(chat.object_descriptions); // 获取并设置 descriptions
          setObjectStory(chat.user_input_story); // 获取并设置 object story
          setCurrentPrompt(chat.chosen_prompt);
          console.log("Object info retrieved.");
        } else {
          console.warn(`Conversation ${conversation_id} not found.1`);
        }
      },
      error: function (e) {
        console.error("Error fetching data: ", conversation_id, "\n", e);
      },
    });
  };

  const sendData = (
    object_name,
    object_description,
    object_story,
    updatedConversation
  ) => {
    // 1. 在 user profile 中找到目标 conversation
    const conversation_new = userChat.find(
      (conv) => conv.conversation_id === conversation_id
    );
    console.log("conversation in user: ", conversation_new);

    // 2. 修改 object_name。现在 conversation_new 里是新的name
    if (conversation_new) {
      conversation_new.object_name = object_name;
      conversation_new.object_descriptions = object_description;
      conversation_new.user_input_story = object_story;
      console.log(
        "Updated object name, description, and story: ",
        conversation_new
      );
    } else {
      console.warn("Conversation not found!");
    }

    // 3. 找到索引
    const index = userChat.findIndex(
      (conv) => conv.conversation_id === conversation_id
    );
    console.log("Find chat index: ", index);

    // 4. 替换原数组中的对象
    if (index !== -1) {
      userChat[index] = conversation_new;
      console.log("User conversations updated:", userChat);
    } else {
      console.warn("Conversation not found");
    }

    // 更新 user chats
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
        resource_id: resource_id,
        token: "token_for_identifier",
      },
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        conversations: userChat, // 只发送新 conversation
      }),
      success: function (response) {
        console.log(
          "New object name updated in user conversation data: ",
          conversation_new
        );
        //storeConversationSeparately(newConversation);
        //if (callback) callback(); // 如果有回调，确保继续执行后续逻辑
      },
      error: function (err) {
        console.error(
          "Error updating object name in user conversations",
          userDataModel.conversations
        );
        console.error("Resource_id: ", resource_id);
      },
    });

    // 更新 object chat
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
        //resource_id: resource_id + conversation_id,
        resource_id: conversation_id,
        token: "token_for_identifier",
      },
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(updatedConversation),
      success: function (data) {
        console.log("Data saved: ", data);
        // 成功保存后，可以更新 UI 或用户的状态
      },
      error: function (e) {
        console.error("Error saving data: ", e);
      },
    });
  };

  const handleUpdate = () => {
    setShowConfirmation(true); // 弹窗

    // 找到该 conversation
    const conversation1 = objectChat;
    console.log("conversation1: ", conversation1);
    if (conversation1) {
      // 将更新后的 userFacts，objectFacts 都存入 conversation
      conversation1.object_name = objectName;
      conversation1.object_descriptions = objectDescription;
      conversation1.user_input_story = objectStory;
      // 调用 sendData 保存更新后的 conversation
      sendData(objectName, objectDescription, objectStory, conversation1);
    } else {
      console.error(`Conversation not found. ID: ${conversation_id}`);
      console.log("Available conversations:", objectChat);
      console.log(conversation_id);
      //console.error("Conversation not found.");
    }

    //sendData(conversation_id); //
    setTimeout(() => {
      // 弹出窗口提醒更新完成，并延迟返回 chatPage
      navigate(`/chat/${conversation_id}`, {
        state: {
          objectName: objectName,
          resource_id: resource_id, // 将resource_id传入chatPage
        },
      });
    }, 2000); // 延迟自动跳转
  };

  const handleBack = () => {
    navigate(`/chat/${conversation_id}`, {
      state: {
        objectName: objectName,
        resource_id: resource_id, // 将resource_id传入chatPage
      },
    });
  };

  return (
    <div className="story-page-container">
      <div className="story-page full-height">
        <div className="nav-bar2">
          <button className="back-btn" onClick={handleBack}>
            <GoChevronLeft size={24} />
          </button>
          <button
            className="done-btn"
            onClick={handleUpdate}
            style={{ paddingRight: "0" }}
          >
            Update
          </button>
        </div>
        <div className="story-input-area" style={{ paddingTop: "0" }}>
          {objectPhoto ? (
            <div className="captured-photo-area">
              <div className="photo-display-round">
                <img src={objectPhoto} alt="Captured" />
              </div>
            </div>
          ) : (
            <p>No photo available.</p>
          )}
          {/* 弹窗 */}
          {showConfirmation && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Object info updated!</h3>
                <p style={{ fontSize: "14px" }}>Returning to the chat...</p>
              </div>
            </div>
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
              className="descriptives-input"
              type="text"
              //placeholder="- Size, color, shape, function..."
              value={objectDescription}
              style={{ minHeight: "72px" }}
              onChange={(e) => setObjectDescription(e.target.value)}
            />
          </div>
          <div style={{ width: "284px" }}>
            <p
              className="storytext"
              style={{
                paddingBottom: "4px",
                paddingTop: "12px",
                fontWeight: "500",
              }}
            >
              Lastly, tell me about this object 😊
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
