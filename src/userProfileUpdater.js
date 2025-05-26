const api_key_AI =
  "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";

// 用来在后台自动更新 memoryPrompt 里的 user profile facts。
export async function userFactsExtracter(chatHistory) {
  const userFactsExtractingPrompt = `
  You are an assistant who is good at extracting facts.
  Given the following conversations, extract only the facts of the "user" in a few bullet points. 
  Focus on the user's informational facts, personality, preferences, habits, conversation style. Make the sentences concise.  
  Output Only the bullet points. 
  
  Conversation:
  ${chatHistory}
  
  Facts:
  `;

  try {
    const text = await getLocalAIResponse(userFactsExtractingPrompt); // 使用 await
    console.log("Extracted recent user facts: ", text);
    return text;
  } catch (err) {
    console.error("Error extracting recent user facts:", err);
    return null;
  }
}

export async function integratedUserFacts(oldUserFacts, recentUserFacts) {
  const userProfileIntegrationPrompt = `
    You are integrating an object's long-term facts based on previous facts and new facts.
    [Previous object facts]: ${oldUserFacts}
    [New object facts]: ${recentUserFacts}
    Please integrate relevant new facts and retain old facts that are still relevant. Make the sentences concise. 
    Merge those similar ones. Keep the important ones. 
    Output Only the bullet points. 

    Integrated object facts:
    `;

  try {
    const text = await getLocalAIResponse(userProfileIntegrationPrompt); // 使用 await
    console.log("Integrated user facts: ", text);
    return text;
  } catch (err) {
    console.error("Error integrating user facts:", err);
    return null;
  }
}

const getLocalAIResponse = (promptToAI) => {
  return new Promise((resolve, reject) => {
    // 调用 localAI API
    foundry.textToText({
      api_token: api_key_AI,
      server: "https://data.id.tue.nl",
      //model: "hermes-2-pro-llama-3-8b",
      model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      prompt: promptToAI,
      temperature: 0.1,
      maxTokens: 2000,
      //logging: true,
      //loadingElementSelector: "#loading-indicator",
      resultElementSelector: "#result-container-userProfile",
    });
    // 确保 result-container-userProfile 元素存在
    const resultContainer = document.querySelector(
      "#result-container-userProfile"
    );
    if (!resultContainer) {
      console.error("Error: #result-container-userProfile not found.");
      return reject("Element #result-container-userProfile not found.");
    }

    // 清空 result-container-userProfile 内容，防止旧的结果叠加
    resultContainer.innerHTML = "";

    // 使用 MutationObserver 来监听 result-container 中的变化
    const observer = new MutationObserver(() => {
      const resultText = resultContainer.innerHTML; // 获取元素内容
      if (resultText) {
        console.log("Fetched AI-extracted user facts:", resultText);
        // 停止观察
        observer.disconnect();
        resolve(resultText); // 返回响应文本
      }
    });

    // 配置 MutationObserver，观察内容变化
    observer.observe(resultContainer, { childList: true, subtree: true });
  });
};
