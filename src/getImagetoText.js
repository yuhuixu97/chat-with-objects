const api_key_AI =
  "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";

export default async function getImagetoText(imageURL) {
  const prompt = `
    Describe the object in the center of this photo, including its color, material, size, shape, and surrounding environment. Maximum 50 words.
    `;

  try {
    const phototoText = await getLocalAIResponse(imageURL, prompt); // 使用 await
    console.log("photo-to-text: ", phototoText);
    return phototoText;
  } catch (err) {
    console.error("Error generating photo-to-text:", err);
    return null;
  }
}

const getLocalAIResponse = (imageURL, promptToAI) => {
  return new Promise((resolve, reject) => {
    // 调用 localAI API
    foundry.imageToText({
      api_token: api_key_AI,
      server: "https://data.id.tue.nl",
      model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      prompt: promptToAI,
      image: imageURL,
      temperature: 0.1,
      maxTokens: 200,
      //logging: true,
      //loadingElementSelector: "#loading-indicator",
      resultElementSelector: "#result-container-photo-to-text",
    });
    // 确保 result-container-photo-to-text 元素存在
    const resultContainer = document.querySelector(
      "#result-container-photo-to-text"
    );
    if (!resultContainer) {
      console.error("Error: #result-container-photo-to-text not found.");
      return reject("Element #result-container-photo-to-text not found.");
    }

    // 清空 result-container-photo-to-text 内容，防止旧的结果叠加
    resultContainer.innerHTML = "";

    // 使用 MutationObserver 来监听 result-container 中的变化
    const observer = new MutationObserver(() => {
      const resultText = resultContainer.innerHTML; // 获取元素内容
      if (resultText) {
        console.log("Fetched photo-to-text:", resultText);
        // 停止观察
        observer.disconnect();
        resolve(resultText); // 返回响应文本
      }
    });

    // 配置 MutationObserver，观察内容变化
    observer.observe(resultContainer, { childList: true, subtree: true });
  });
};
