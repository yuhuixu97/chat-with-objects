const api_key_AI =
  "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";

// 用来在后台自动更新 memoryPrompt 里的 object profile facts。
async function objectTraitsSpeculator(descriptions, stories) {
  const objectTraitsSpeculatingPrompt = `
  The input includes descriptions of an object—its size, color, shape, function, impression, emotional impact, and personal story with the user. 
  Based on this information, imagine the object could speak. 
  Generate 3 anthropomorphic personality traits it might exhibit. 
  Out put less than 50 words.
  
  Input:
  ${(descriptions, ". ", stories)}
  `;

  try {
    const traits = await getLocalAIResponse_traits(
      objectTraitsSpeculatingPrompt
    ); // 使用 await
    console.log("Speculated object peronality traits: ", traits);
    return traits;
  } catch (err) {
    console.error("Error Speculating object personality traits:", err);
    return null;
  }
}

async function objectBehaviorSpeculator(descriptions, stories) {
  const objectBehaviorSpeculatingPrompt = `
  The input includes descriptions of an object—its size, color, shape, function, impression, emotional impact, and personal story with the user. 
  Based on this information, imagine the object could speak. 
  Speculate and tell me "how should the object behave in the upcoming chats?".  
  Output only the behaviors 1-3 in less than 50 words.
  
  Input:
  ${(descriptions, ". ", stories)}
    `;

  try {
    const behaviors = await getLocalAIResponse_bahaviors(
      objectBehaviorSpeculatingPrompt
    ); // 使用 await
    console.log("Speculated object conversational behaviors: ", behaviors);
    return behaviors;
  } catch (err) {
    console.error("Error Speculating object conversational behaviors:", err);
    return null;
  }
}

const getLocalAIResponse_traits = (promptToAI) => {
  return new Promise((resolve, reject) => {
    // 调用 localAI API
    foundry.textToText({
      api_token: api_key_AI,
      server: "https://data.id.tue.nl",
      //model: "hermes-2-pro-llama-3-8b",
      model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      prompt: promptToAI,
      temperature: 0.2,
      maxTokens: 100,
      //logging: true,
      //loadingElementSelector: "#loading-indicator",
      resultElementSelector: "#result-container-objectTraits",
    });
    // 确保 result-container 元素存在
    const resultContainer = document.querySelector(
      "#result-container-objectTraits"
    );
    if (!resultContainer) {
      console.error("Error: #result-container-objectTraits not found.");
      return reject("Element #result-container-objectTraits not found.");
    }

    // 清空 result-container 内容，防止旧的结果叠加
    resultContainer.innerHTML = "";

    // 使用 MutationObserver 来监听 result-container 中的变化
    const observer = new MutationObserver(() => {
      const resultText = resultContainer.innerHTML; // 获取元素内容
      if (resultText) {
        console.log("Fetched AI-speculated object traits:", resultText);
        // 停止观察
        observer.disconnect();
        resolve(resultText); // 返回响应文本
      }
    });

    // 配置 MutationObserver，观察内容变化
    observer.observe(resultContainer, { childList: true, subtree: true });
  });
};

const getLocalAIResponse_bahaviors = (promptToAI) => {
  return new Promise((resolve, reject) => {
    // 调用 localAI API
    foundry.textToText({
      api_token: api_key_AI,
      server: "https://data.id.tue.nl",
      //model: "hermes-2-pro-llama-3-8b",
      model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      prompt: promptToAI,
      temperature: 0.2,
      maxTokens: 100,
      //logging: true,
      //loadingElementSelector: "#loading-indicator",
      resultElementSelector: "#result-container-objectBehaviors",
    });
    // 确保 result-container 元素存在
    const resultContainer = document.querySelector(
      "#result-container-objectBehaviors"
    );
    if (!resultContainer) {
      console.error("Error: #result-container-objectBehaviors not found.");
      return reject("Element #result-container-objectBehaviors not found.");
    }

    // 清空 result-container 内容，防止旧的结果叠加
    resultContainer.innerHTML = "";

    // 使用 MutationObserver 来监听 result-container 中的变化
    const observer = new MutationObserver(() => {
      const resultText = resultContainer.innerHTML; // 获取元素内容
      if (resultText) {
        console.log("Fetched AI-speculated object behaviors:", resultText);
        // 停止观察
        observer.disconnect();
        resolve(resultText); // 返回响应文本
      }
    });

    // 配置 MutationObserver，观察内容变化
    observer.observe(resultContainer, { childList: true, subtree: true });
  });
};

export { objectTraitsSpeculator, objectBehaviorSpeculator };
