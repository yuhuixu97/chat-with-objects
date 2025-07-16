import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  userDataModel,
  addConversation,
  initializeUser,
  fetchUserData,
} from "../userDataModel";

import { updateConversationInDatabase } from "../userDataModel";
import {
  generatePrompt,
  updateUserProfile,
  updateObjectProfile,
} from "../memoryPrompt";
import { splitTextIntoSentences } from "../splieSentences";
import { getResourceId } from "../resource"; // 导入设置方法

// icons
import { GoChevronLeft } from "react-icons/go";
import { GoPaperAirplane } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";
import { AiOutlineEllipsis } from "react-icons/ai";

export default function ChatPage() {
  const navigate = useNavigate();
  const { conversation_id } = useParams(); // 直接获取 conversation_id
  const location = useLocation();
  // 从 location.state 获取传递的 imageUrl, objectName, objectDescription, newChat_id
  const { objectName } = location.state || {};
  const { resource_id } = location.state || {}; // 从 ChatList 获得 resource_id

  //const chat = chatData[id] || { name: "Unknown", messages: [] };
  //const [messages, setMessages] = useState(chat.messages);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userConversations, setUserConversations] = useState([]); // 用户的所有对话数据
  const [objectImage, setObjectImage] = useState(""); // 新增状态来保存对象的 imageUrl
  const [userAvatar, setUserAvatar] = useState(null); // 新增状态来保存 user avatar imageUrl
  const [objectStory, setObjectStory] = useState(""); // 新增状态来保存 object 的 story
  const [objectDescription, setObjectDescription] = useState(""); // 新增状态来保存 object 的 descriptions
  //const [objectPhotoToText, setObjectPhotoToText] = useState(""); // 新增状态来保存 object 的 Photo-To-Text
  const [objectChosenPrompt, setObjectChosenPrompt] = useState(""); // 新增状态来保存挑选 object 时候的 prompt
  const [objectFacts, setObjectFacts] = useState(""); // 新增状态来保存更新后的 object facts
  const [userFacts, setUserFacts] = useState(""); // 新增状态来保存更新后的 user facts
  const [loading, setLoading] = useState(false);
  //const [resource_id, setResourceId] = useState("");

  //let resource_id = "uac633de71b774f31"; // developer
  //let resource_id = "";
  const api_key_AI =
    "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";
  const url = `https://data.id.tue.nl/datasets/entity/14395/item/`;
  const apiToken =
    "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";
  const token = "token_for_identifier";

  const hasFetched = useRef(false);
  const lastMessageRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // 所有的 chat history
  const [chatHistory, setchatHistory] = useState("");
  const [recentChatHistory, setrecentChatHistory] = useState("");

  // 页面加载时获取 resource_id
  /*useEffect(() => {
    resource_id = getResourceId();
    console.log("resource_id get: ", resource_id);
  }, []);*/

  // 页面加载时获取 resource_id
  /*useEffect(() => {
    const id = getResourceId();
    setResourceId(id);
    console.log("resource_id set: ", id);
  }, []);*/

  useEffect(() => {
    if (!conversation_id) {
      alert("Conversation not found");
      navigate("/");
      return;
    }
    console.log("Conversation_id: " + conversation_id);

    if (!hasFetched.current) {
      getData(conversation_id); // 通过 id 获取聊天数据
      console.log("Getting data...");
      getUserData();
      hasFetched.current = true;
    }
  }, [conversation_id]); // 当 id 变化时，重新加载数据

  // 这里是为了在新建chat之后的第一次聊天，能在数据库中定位到这个new chat
  useEffect(() => {
    console.log("Updated conversations:", userConversations);
  }, [userConversations]); // 监听 userConversations 的变化

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Updated messages:", messages);
    }
  }, [messages]); // 监听 messages 更新

  // 监听 messages 变化，并滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  // 监听 userFacts 变化。
  useEffect(() => {
    console.log("userFacts updated:", userFacts);
  }, [userFacts]);

  // chat input 的自动变化
  const initialHeight = 22; // 初始 input 高度（你想设多少都行）
  const handleInputChange = (e) => {
    const textarea = textareaRef.current;
    const value = e.target.value;
    setInput(value);
    // 每次输入前重置 scrollTop
    textarea.scrollTop = 0;
    // 判断是否为空
    if (value.trim().length === 0) {
      textarea.style.height = `${initialHeight}px`;
      textarea.style.overflowY = "hidden"; // 确保没有滚动条
    } else {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      // 只在需要时启用滚动条（可选）
      textarea.style.overflowY =
        textarea.scrollHeight > textarea.clientHeight ? "auto" : "hidden";
    }
  };

  const getData = (conversationId) => {
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
          setUserConversations([chat]);
          // 查找当前 conversation_id 的聊天记录
          setMessages(chat.messages || []);
          setObjectImage(chat.avatar_url); // 获取并设置 imageUrl
          setObjectDescription(chat.object_descriptions); // 获取并设置 descriptions
          setObjectStory(chat.user_input_story); // 获取并设置 object story
          //setObjectPhotoToText(chat.photo_to_text); // 获取并设置 object photo-to-text
          setObjectChosenPrompt(chat.chosen_prompt); // 获取并设置 object chosenPrompt
          setUserFacts(chat.user_facts); // 获取并设置 user facts
          setObjectFacts(chat.object_facts); // 获取并设置 object facts

          // 将历史消息格式化为 chatHistory
          const formattedHistory =
            Array.isArray(chat.messages) && chat.messages.length > 0
              ? chat.messages
                  .map((msg) => `${msg.sender}: ${msg.content}`)
                  .join("\n")
              : "No messages yet.";
          setchatHistory(formattedHistory);

          // 输出另一个版本为最近的15条消息，提供memory以及上下文
          const formattedRecentChatHistory =
            Array.isArray(chat.messages) && chat.messages.length > 0
              ? chat.messages
                  .slice(-12) // 截取最后 15 条
                  .map((msg) => `${msg.sender}: ${msg.content}`)
                  .join("\n")
              : "No messages yet.";
          //console.log("type of formattedHistory: ", typeof formattedHistory);
          setrecentChatHistory(formattedRecentChatHistory);

          console.log("Chat history: ", formattedHistory);
        } else {
          console.warn(`Conversation ${conversation_id} not found.1`);
        }
      },
      error: function (e) {
        console.log(resource_id + conversation_id);
        console.error("Error fetching data: ", e);
      },
    });
  };

  // fetch conversations
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
        console.error("Error fetching data:", e);
      },
    });
  };

  const sendMessageHandler = async () => {
    if (input.trim()) {
      // 延迟显示 loading，不阻塞下面的代码
      setTimeout(() => {
        setLoading(true);
      }, 500);

      // 创建新的消息对象
      const newMessage = {
        message_id: `${conversation_id}_${Date.now()}`, // 生成唯一的消息ID
        sender: "Me", // 假设发送者是当前用户
        content: input, // 使用 content 而不是 text
        timestamp: new Date().toLocaleString(), // 设置时间戳
      };

      // 如果和上次发送的消息相同，阻止重复添加
      if (lastMessageRef.current?.message_id === newMessage.message_id) {
        console.warn("Duplicate message detected, ignoring...");
        setLoading(false);
        return;
      }
      // 更新消息列表
      // 这里comment掉了，是因为chatPage刷新后的第一条消息会显示两次
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 追加新 user input 到 chatHistory
      setchatHistory((prevChatHistory) => prevChatHistory + `\nMe: ${input}`);
      console.log("Updated chat history: ", chatHistory);

      // 把最新消息同步到 user conversation lastMessage
      const conversation = userDataModel.conversations.find(
        (conv) => conv.conversation_id === conversation_id
      );
      console.log("conversation: ", conversation);

      if (conversation) {
        if (!Array.isArray(conversation.messages)) {
          conversation.messages = []; // 确保 messages 是数组
        }

        if (conversation.messages.length === 0) {
          conversation.messages.push(newMessage);
          console.log("conversation.messages: ", conversation.messages);
        } else if (conversation.messages.length === 1) {
          conversation.messages[0] = newMessage; // 替换唯一元素
          console.log("conversation.messages: ", conversation.messages);
        } else {
          console.warn("messages is longer than 1");
        }
      } else {
        console.error("Conversation not found.");
      }
      // 把新的user conversation发送到数据库
      //updateConversationInDatabase(userDataModel.user_id, conversation);

      console.log("resource_id before updateUserConversation: ", resource_id); //log显示，resource_id在这里就已经是空了
      updateUserConversation(
        userDataModel.user_id,
        conversation_id,
        resource_id,
        conversation
      );

      // 调用发送消息的函数
      sendMessage(conversation_id, newMessage);
      setInput(""); // 清空输入框

      const textarea = document.querySelector(".chat-input textarea");
      if (textarea) textarea.style.height = "auto";

      // 生成 AI 响应
      // 总的 prompt to AI
      const prompt = generatePrompt(
        input,
        recentChatHistory,
        objectDescription,
        //objectPhotoToText,
        objectStory,
        objectName,
        objectChosenPrompt,
        userFacts,
        objectFacts
      );
      console.log("Prompt: ", prompt);

      /* 
      const updatedPrompt =
        "This is the previous chat: \n" +
        chatHistory +
        "\nMe: " +
        input +
        "\nBased on the chat history, please reply SHORTLY to my last input. Focus on the recent 10 messages, but refer to older messages if you need to. Reply short.";
      console.log("Prompt: ", updatedPrompt);
      */
      //getLocalAIResponse(updatedPrompt);

      try {
        await getLocalAIResponse(prompt); // <-- 等AI返回
      } catch (error) {
        console.error("Error fetching AI response:", error);
        // 可以根据需要提示用户
      }

      // 更新最近 12 条 chat messages
      updateRecentChatHistory(conversation_id);

      // 根据chat history 来更新 summary
      //updateMemorySummary(recentChatHistory);

      // 提取并更新 user facts
      const integratedUserFacts = await updateUserProfile(
        recentChatHistory,
        userFacts
      );
      //console.log("User facts updated: ", integratedUserFacts);
      setUserFacts(integratedUserFacts);

      // 提取并更新 object facts
      /*const integratedObjectFacts = await updateObjectProfile(
        recentChatHistory,
        objectFacts // 数据库读出来的之前的 facts
      );*/
      //setObjectFacts(integratedObjectFacts);

      lastMessageRef.current = newMessage;
    }
  };

  // 把最新的一条消息更新到user conversation data中
  const updateUserConversation = (
    user_id,
    conversation_id,
    resource_id,
    newConversation,
    callback
  ) => {
    fetchUserData(user_id, (fetchedUserData) => {
      if (!fetchedUserData) {
        console.log("No fetched user data");
        return;
      }
      // 把newConversation替换掉这个id的conversation
      const index = fetchedUserData.conversations.findIndex(
        (conv) => conv.conversation_id === conversation_id
      );
      if (index !== -1) {
        // 如果找到了，替换原来的 conversation
        fetchedUserData.conversations[index] = newConversation;
      }
      console.log("Conversation updated to user: ", fetchedUserData);
      console.log("resource_id: ", resource_id);

      // 在user conversations里新增加一条conversation
      $.ajax({
        url: url,
        headers: {
          api_token: apiToken,
          resource_id: resource_id,
          token: token,
        },
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          conversations: fetchedUserData.conversations, // 只发送新 conversation
        }),
        success: function (response) {
          console.log(
            "Last message updated in user conversation data",
            newConversation
          );
          //storeConversationSeparately(newConversation);
          if (callback) callback(); // 如果有回调，确保继续执行后续逻辑
        },
        error: function (err) {
          console.error("Error updating user conversations", fetchedUserData);
          console.error("Resource_id: ", resource_id);
        },
      });
    });
  };

  // 把message发送到数据库
  const sendMessage = (conversationId, newMessage) => {
    if (!userConversations.length) {
      console.error("User conversations not loaded yet.");
      return;
    }

    // console.log("User: ", userConversations);

    // 找到该 conversation
    const conversation1 = userConversations.find(
      (conv) => String(conv.conversation_id) === String(conversationId)
    );

    if (conversation1) {
      // 将新消息添加到 conversation 的 messages 中
      conversation1.messages.push(newMessage);
      // 将更新后的 userFacts，objectFacts 都存入 conversation
      //conversation.object_facts = objectFacts;
      conversation1.user_facts = userFacts;
      // 调用 sendData 保存更新后的 conversation
      sendData(conversation1);
    } else {
      console.error(`Conversation not found. ID: ${conversationId}`);
      console.log("Available conversations:", userConversations);
      console.log(conversationId);
      //console.error("Conversation not found.");
    }
  };

  const sendAIMessage = (conversationId, newAiMessages) => {
    if (!userConversations.length) {
      console.error("User conversations not loaded yet.");
      return;
    }
    // 找到该 conversation
    const conversation = userConversations.find(
      (conv) => String(conv.conversation_id) === String(conversationId)
    );

    if (conversation) {
      // 将新消息添加到 conversation 的 messages 中
      conversation.messages.push(...newAiMessages);
      // 将更新后的 userFacts，objectFacts 都存入 conversation
      //conversation.object_facts = objectFacts;
      conversation.user_facts = userFacts;
      // 调用 sendData 保存更新后的 conversation
      sendData(conversation);
    } else {
      console.error(`Conversation not found. ID: ${conversationId}`);
      console.log("Available conversations:", userConversations);
      console.log(conversationId);
      //console.error("Conversation not found.");
    }
  };

  // 调用 localAI API 获取响应
  const getLocalAIResponse = (promptToAI) => {
    return new Promise((resolve, reject) => {
      // 调用 localAI API
      foundry.textToText({
        api_token: api_key_AI,
        server: "https://data.id.tue.nl",
        //model: "hermes-2-pro-llama-3-8b",
        model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
        //prompt: userInput + ", provide short reply",
        prompt: promptToAI,
        temperature: 0.5,
        maxTokens: 100,
        logging: true,
        //loadingElementSelector: "#loading-indicator",
        resultElementSelector: "#result-container",
      });
      // 确保 result-container 元素存在
      const resultContainer = document.querySelector("#result-container");
      if (!resultContainer) {
        console.error("Error: #result-container not found.");
        return reject("Element #result-container not found.");
      }

      // 清空 result-container 内容，防止旧的结果叠加
      resultContainer.innerHTML = "";

      // 使用 MutationObserver 来监听 result-container 中的变化
      const observer = new MutationObserver(() => {
        const resultText = resultContainer.innerHTML; // 获取元素内容
        if (resultText) {
          console.log("Fetched AI response:", resultText);

          // 这里可以插入一个拆分ai返回文本（resultText）的function，把一段文本拆分成多句话，输入一个字符串数组
          const splitedSentences = splitTextIntoSentences(resultText);
          console.log("Splited sentences: ", splitedSentences);

          // 创建 AI 消息对象
          /*const newAiMessage = {
            message_id: `ai_${conversation_id}_${Date.now()}`,
            sender: "AI",
            content: resultText, // AI response
            timestamp: new Date().toLocaleString(),
          };*/
          // 拆分句子后的 AI 消息数组
          const newAiMessages = splitedSentences.map((sentence, index) => ({
            message_id: `ai_${conversation_id}_${Date.now()}_${index}`,
            sender: "AI",
            content: sentence,
            timestamp: new Date().toLocaleString(),
          }));

          // 每句话之间加时间间隔
          const delayAiMessages = async () => {
            let totalDelay = 0;

            for (let i = 0; i < newAiMessages.length; i++) {
              const msg = newAiMessages[i];
              const delay = msg.content.length * 80;

              await new Promise((resolve) => setTimeout(resolve, delay));

              setMessages((prev) => [...prev, msg]);
              console.log("Message: ", msg, "\nTime: ", delay);

              if (i === newAiMessages.length - 1) {
                setLoading(false);
              }
            }
          };
          delayAiMessages(); // 👈 这里直接调用

          //setMessages((prevMessages) => [...prevMessages, newAiMessage]);
          //setMessages((prevMessages) => [...prevMessages, ...newAiMessages]);
          //console.log("Messages: ", messages);

          // 追加 AI 回复到 chatHistory
          /*setchatHistory(
            (prevChatHistory) => prevChatHistory + `\nAI: ${resultText}`
          );*/
          setchatHistory((prevChatHistory) => {
            const newText = newAiMessages
              .map((msg) => `\nAI: ${msg.content}`)
              .join("");
            return prevChatHistory + newText;
          });

          // 把最新 AI 消息同步到 user conversation lastMessage
          const conversation = userDataModel.conversations.find(
            (conv) => conv.conversation_id === conversation_id
          );
          console.log("conversation: ", conversation);
          //找到数组中的最后一个message
          const lastAiSentence = newAiMessages[newAiMessages.length - 1];

          //更新user conversation中的最新一条消息
          if (conversation) {
            if (!Array.isArray(conversation.messages)) {
              conversation.messages = []; // 确保 messages 是数组
            }

            if (conversation.messages.length === 0) {
              //conversation.messages.push(newAiMessage);
              conversation.messages.push(lastAiSentence);
              console.log("conversation.messages: ", conversation.messages);
            } else {
              conversation.messages = [lastAiSentence]; // 替换唯一元素
              console.log("conversation.messages: ", conversation.messages);
            }
          } else {
            console.error("Conversation not found.");
          }
          // 把新的user conversation发送到数据库
          //updateConversationInDatabase(userDataModel.user_id, conversation);

          updateUserConversation(
            userDataModel.user_id,
            conversation_id,
            resource_id,
            conversation
          );

          sendAIMessage(conversation_id, newAiMessages);

          // 停止观察
          observer.disconnect();

          resolve(resultText); // 返回响应文本
        }
      });

      // 配置 MutationObserver，观察内容变化
      observer.observe(resultContainer, { childList: true, subtree: true });
    });
  };

  // 更新用户的 conversations
  /*const updateUserConversations = (newConversation) => {
    setUserConversations((prevConversations) => {
      const updatedConversations = [...prevConversations];
      updatedConversations.push(newConversation);
      return updatedConversations;
    });
  };*/

  const sendData = (updatedConversation) => {
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

  // 在发送消息并存储后，再get一次data，获得最近10条消息
  const updateRecentChatHistory = (conversationId) => {
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
        //console.log("Chat data retrieved: ", chat);
        if (chat) {
          //setUserConversations([chat]);
          // 查找当前 conversation_id 的聊天记录
          //setMessages(chat.messages || []);
          //setObjectImage(chat.avatar_url); // 获取并设置 imageUrl

          // 输出另一个版本为最近的15条消息，提供memory以及上下文
          const formattedRecentChatHistory =
            Array.isArray(chat.messages) && chat.messages.length > 0
              ? chat.messages
                  .slice(-15) // 截取最后 15 条
                  .map((msg) => `${msg.sender}: ${msg.content}`)
                  .join("\n")
              : "No messages yet.";
          //console.log("type of formattedHistory: ", typeof formattedHistory);
          setrecentChatHistory(formattedRecentChatHistory);

          console.log("15 Chat history: ", formattedRecentChatHistory);
        } else {
          console.warn(`Conversation ${conversation_id} not found.`);
        }
      },
      error: function (e) {
        console.log(resource_id + conversation_id);
        console.error("Error fetching data: ", e);
      },
    });
  };

  return (
    <div className="chat-container full-height">
      <div className="chat-page">
        <nav className="navbar">
          <button className="back-btn" onClick={() => navigate("/")}>
            <GoChevronLeft size={24} />
          </button>
          <header className="chat-header">{objectName}</header>
          <button
            className="more-btn"
            onClick={() =>
              navigate("/ObjectEditingPage", { state: { conversation_id } })
            }
          >
            <AiOutlineEllipsis size={24} />
          </button>
        </nav>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "Me" ? "my-message" : "other-message"
              }`}
            >
              <div className="message-avatar">
                {msg.sender === "AI" ? (
                  // 如果是 AI 消息，使用 object 本身的 avatar_url
                  <img
                    src={objectImage}
                    alt="AI Avatar"
                    className="avatar-img"
                  />
                ) : (
                  // 否则，显示发送者的首字母
                  //msg.sender.charAt(0)
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    className="avatar-img"
                  />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                {/* 使用 content */}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 滚动锚点 */}
        </div>
        {/* AI 返回文本容器（result-container） */}
        <div id="result-container" style={{ display: "none" }}></div>
        {/* AI 返回文本容器（result-container-userProfile） */}
        <div
          id="result-container-userProfile"
          style={{ display: "none" }}
        ></div>
        {/* AI 返回文本容器（result-container-objectProfile） */}
        <div
          id="result-container-objectProfile"
          style={{ display: "none" }}
        ></div>

        <div className="message-assistant">
          {loading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="chat-input">
          <textarea
            type="text"
            value={input}
            ref={textareaRef}
            onChange={handleInputChange}
            placeholder="Type a message..."
            rows={1}
          />
          <button
            onClick={sendMessageHandler}
            disabled={!input.trim()}
            className={`send-button ${input.trim() ? "active" : "disabled"}`}
          >
            <AiOutlineSend size={20} style={{ marginLeft: "2px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

//根据userdata里的conversations的conversation_id，找到当前的conversation，然后查询当前conversation下的messages
