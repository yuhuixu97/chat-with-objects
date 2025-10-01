const api_key_AI =
  "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";

/*You are an assistant who is good at extracting facts.
  Given the following conversations, extract only the facts of the "user" in a few bullet points. 
  Focus on the user's informational facts, personality, preferences, habits, conversation style. Make the sentences concise.  
  Output only the bullet points.  */
// 用来在后台自动更新 memoryPrompt 里的 user profile facts。

/*
You are a fact extractor assistant. Given the following conversation, extract only concise, factual bullet points about the user. Focus on user's:
  1) identity (e.g. occupation, role, age group if clear)
  2) emotional state
  3) preferences and habits
  4) conversation style
  5) recurring behaviors or attitudes
  Avoid speculation, duplication, or vague language. Each bullet should be fact-based, concise, and informative. Output only the bullet points.
 
*/

export async function userFactsExtracter(chatHistory) {
  const userFactsExtractingPrompt = `
  You are a fact extractor assistant. 
  Given the following conversation, extract only concise, factual bullet points about the user. 

  Focus strictly on:  
  1) Identity (e.g., occupation, role, age group if clearly stated)  
  2) Emotional state (only if explicitly mentioned)  
  3) Preferences and habits (e.g., likes, dislikes, routines)  
  4) Conversation style (e.g., concise, detailed, humorous)  
  5) Recurring behaviors or attitudes  

  Rules:  
  - Always process the given conversation, whether fictional or real.  
  - Use only information explicitly present in the conversation.  
  - Do not output generic facts like "the user is an individual."  
  - Do not speculate or infer unstated details.  
  - If no information is available for a category, write: "No information available."  
  - Output only bullet points. Each point must be informative and specific.

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
    [Previous user facts]: ${oldUserFacts}
    [New user facts]: ${recentUserFacts}
    Please integrate relevant new facts and retain old facts that are still relevant. Make the sentences concise. 
    Merge those similar ones. Keep the important ones. 
    Output less than 10 bullet points. Output only the results. 

    Integrated user facts:
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
      model: "hermes-2-pro-llama-3-8b",
      //model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      prompt: promptToAI,
      temperature: 0.1,
      maxTokens: 300,
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
