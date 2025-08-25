import $ from "jquery";
import React, { useState, useEffect } from "react";
import { getResourceId } from "./resource"; // 导入设置方法

// user
const userDataModel = {
  user_id: "",
  username: "",
  user_avatar_url: "https://api.dicebear.com/9.x/shapes/svg?seed=Robert", // default avatar
  created_at: new Date().toLocaleString(),
  conversations: [],
};

let resource_id = "uac633de71b774f31"; // developer id
const apiToken = "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";
const token = "token_for_identifier";
const url = `https://data.id.tue.nl/datasets/entity/14395/item/`;

function setRId() {
  // 获取全局变量并赋值到本文件的resource_id
  console.log("Resource_id set: ", getResourceId());
  return getResourceId();
}

// 在数据库中创建一个新用户
function createNewUser(callback) {
  const rid = setRId(); // 设置本函数要调用的 resource_id
  const user = userDataModel;

  $.ajax({
    url: url,
    headers: {
      api_token: apiToken,
      resource_id: rid,
      token: token,
    },
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: function (response) {
      console.log("New user created in database:", user);
      if (callback) callback(user);
    },
    error: function (err) {
      console.error("Error creating new user:", user);
      if (callback) callback(null);
    },
  });
}

// initialize user
function initializeUser(userId, username = "") {
  userDataModel.user_id = userId;
  userDataModel.username = username;
}

// **异步获取用户数据**
function fetchUserData(userId, callback) {
  const rid = setRId(); // 设置本函数要调用的 resource_id
  console.log("fetchUserData rid: ", rid);

  $.ajax({
    url: url,
    headers: {
      api_token: apiToken,
      resource_id: rid,
      token: token,
    },
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("Fetched user data:", data);
      // 如果返回数据为空，初始化为默认对象
      if (!data || !data.conversations) {
        data = { user_id: userId, conversations: [] };
      }
      callback(data); // 把获取到的数据传给回调函数
    },
    error: function (err) {
      console.error("Error fetching user data:", err);
      console.log("Creating new user due to fetch error...");
      createNewUser((user) => {
        console.log("callback user:", user);
      });
    },
  });
}

// add a new conversation
function addConversation(
  objectName,
  avatarUrl = "",
  objectDescription,
  objectStory,
  objectMemory,
  chosenPrompt,
  objectEnvironment,
  objectSeculatedTraits,
  objectSpeculatedBehaviors,
  //photoToText,
  lastMessage,
  callback
) {
  const rid = setRId(); // 设置本函数要调用的 resource_id
  console.log("addConversation rid: ", rid);

  console.log("Adding conversation for:", objectName);

  return new Promise((resolve, reject) => {
    fetchUserData(userDataModel.user_id, (fetchedUserData) => {
      if (!fetchedUserData) {
        console.error("Failed to fetch user data before adding conversation.");
        reject("User data fetch failed");
        return;
      }

      // 确保 conversations 存在
      const conversations = fetchedUserData.conversations || [];
      console.log("Conversation length: ", conversations.length);

      // 创建user下的一个新对话
      const newConversation = {
        conversation_id: `${rid}-conversation-${conversations.length + 1}`,
        avatar_url: avatarUrl,
        object_name: objectName,
        user_input_story: objectStory,
        object_related_memory: objectMemory,
        object_descriptions: objectDescription,
        messages: [],
        generated_identity: "",
        object_facts: "",
        user_facts: "",
        chosen_prompt: chosenPrompt,
        object_environment: objectEnvironment,
        object_speculated_traits: objectSeculatedTraits,
        object_speculated_behaviors: objectSpeculatedBehaviors,
        //photo_to_text: photoToText,
        //lastMessage: lastMessage,
      };

      // 先更新数据库
      updateConversationInDatabase(userDataModel.user_id, newConversation);
      console.log("New conversation created:", newConversation);
      resolve(newConversation); // 返回新对话对象，方便更新 UI
    });
  });
}

// 更新数据库的函数，只更新有变化的数据
function updateConversationInDatabase(userId, newConversation, callback) {
  const rid = setRId(); // 设置本函数要调用的 resource_id
  console.log("updateConversationInDatabase rid: ", rid);

  fetchUserData(userId, (fetchedUserData) => {
    if (!fetchedUserData) {
      console.log("No fetched user data");
      return;
    }

    fetchedUserData.conversations.push(newConversation);
    console.log("fetchedUserData", fetchedUserData);

    // 在user conversations里新增加一条conversation
    $.ajax({
      url: url,
      headers: {
        api_token: apiToken,
        resource_id: rid,
        token: token,
      },
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        conversations: fetchedUserData.conversations, // 只发送新 conversation
      }),
      success: function (response) {
        console.log("Conversation updated in user data");
        storeConversationSeparately(newConversation);
        if (callback) callback(); // 如果有回调，确保继续执行后续逻辑
      },
      error: function (err) {
        console.error("Error updating user conversations", fetchedUserData);
      },
    });
  });
}

// 额外存储 conversation 作为独立对象
function storeConversationSeparately(newConversation) {
  const rid = setRId(); // 设置本函数要调用的 resource_id
  console.log("storeConversationSeparately rid: ", rid);
  console.log("start storing conversation separately");

  $.ajax({
    url: url,
    headers: {
      api_token: apiToken,
      resource_id: newConversation.conversation_id,
      token: token,
    },
    type: "POST", // 因为是新增数据
    contentType: "application/json",
    data: JSON.stringify(newConversation),
    success: function (response) {
      console.log("New conversation stored separately", newConversation);
    },
    error: function (err) {
      console.error("Error storing conversation separately");
    },
  });
}

export {
  userDataModel,
  createNewUser,
  addConversation,
  initializeUser,
  updateConversationInDatabase,
  fetchUserData,
};
