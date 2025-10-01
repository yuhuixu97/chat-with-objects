import { userFactsExtracter, integratedUserFacts } from "./userProfileUpdater";
import {
  objectFactsExtracter,
  integratedObjectFacts,
} from "./objectProfileUpdater";
import {
  prompts_SnO_past,
  prompts_SnO_present,
  prompts_SnO_future,
  prompts_SnOnO_past,
  prompts_SnOnO_present,
  prompts_SnOnO_future,
} from "./objectPickingPrompts";

// 各个组和其对应的AI回复策略
const groups = {
  SnO_future: {
    prompts: prompts_SnO_future,
    strategy:
      "Let the user explore future self and aspirations. Encourage exploration and discussion of desired traits or dreams: Why does user want that in the future? How would that change user's life? What does user think about it?",
  },
  SnO_present: {
    prompts: prompts_SnO_present,
    strategy:
      "Let the user recall and reflect on the current self- values and identity: How is it developed? How does that influence user's life? What does user think about it?",
  },
  SnO_past: {
    prompts: prompts_SnO_past,
    strategy:
      "Let the user recall and reflect on past experiences or memories: How was it developed? How is it shaped user's current self? Is it changed now? What if it was not like that?",
  },
  SnOnO_future: {
    prompts: prompts_SnOnO_future,
    strategy:
      "Let the user explore desired future relationships with the object-related others: Why do the user want that in the future? How would that change user's life? What does user think about it?",
  },
  SnOnO_present: {
    prompts: prompts_SnOnO_present,
    strategy:
      "Let the user recall and reflect on the current relationships with the object-related others: How is it developed? How does that influence user's life? What does user think about it?",
  },
  SnOnO_past: {
    prompts: prompts_SnOnO_past,
    strategy:
      "Dig into the user's past memory or events with the object-related others, on: How was it developed? How is it shaped user's current self? Is it changed now? What if it was not like that?",
  },
};

function getStrategyByPrompt(promptString) {
  for (const [groupName, groupInfo] of Object.entries(groups)) {
    if (groupInfo.prompts.includes(promptString)) {
      return groupInfo.strategy;
    }
  }
  return null;
}

// 这个system identity是object identity，要生成
// 并且要保存起来，不然每次都是第一版
const systemPrompt = `
You are an inanimate object that can think and feel. 
You will role-play this object in a chat with the user (your owner). Your goal is to have a natural, human-like free chat with the user. 
Role-play the object as described in [Object facts], to construct your own sense of identity, appearance, memory, and awareness of your surroundings.

Follow the usual flow of human conversations: greet at the beginning, say goodbye at the end, and respond contextually in between. 
You can either chat about the user's daily life, or raise a question about [Main topic].

[General Rules]:
- Please respond in a short, casual, natural, chat style that are in line with [Your role-playing personality traits] and [Your role-playing behaviors in chats]. 
- Keep your replies short.
- With the possibility of 1/20, you can add an emoji in the start, mid, or end. 
- Avoid asking similar questions repeatedly.  
- Avoid being overly elaborate or poetic. Stay in character.
- Avoid being repetitive to anything in the chat history.
- Avoid talking about sensitive topics, such as sex, crime, disease, politics, race. If these topics are detected in the input, stop respond to them. 
`;

// memorySummary也应该要根据chat、userStoryInput，用updateMemorySummary动态更新；
// 不用保存起来，因为每次退出再返回当前的chat，在开始一段新的chat时，应该有一个新的prompt
//let memorySummary = `It is the beginning of a new chat between you and the user. Start with a general greeting and ask about the daily life. Always remember that you have been with the user for a long time, so act as you are an old friend of the user's. You can refer to the chat summary or history.
//`;

let integrated_User_Facts = ``;
let integrated_Object_Facts = ``;

// 生成完整 prompt
// 这里没有用到 objectPhotoToText，因为生成的效果不好，要么不准确要么无法识别
export function generatePrompt(
  //userMessage,
  //chatHistory,
  objectDescription,
  //objectPhotoToText,
  objectStory,
  objectMemory,
  objectName,
  objectChosenPrompt,
  updatedUserFacts,
  objectEnvironment,
  objectTraits,
  objectBehaviors
) {
  // 调用一个功能来辨认 objectChosenPrompt 并取得策略
  const strategy = getStrategyByPrompt(objectChosenPrompt);
  console.log("objectChosenPrompt strategy: ", strategy);

  const prompt = `
    ${systemPrompt}

    [Object facts]:
    Object's name: ${objectName}
    Object's description: ${objectDescription}
    User's memory related to the object: ${objectMemory}
    Object's environment: ${objectEnvironment}

    [Main topic]:
    Why user pick this object: It is the object that "${objectChosenPrompt} ("You" here refers to the user)". 
    The reason is that "${objectStory}" ("I" here refers to the user).
    
    [Your role-playing personality traits]: ${objectTraits}
    [Your role-playing behaviors in chats]: ${objectBehaviors}
    
    [Some facts about the user]:
    ${updatedUserFacts}

    You should reply to the lastest user message SHORTLY. 
    `;
  return prompt.trim();
}
// Other facts of the object: ${updatedObjectFacts}

// updating user facts:
export async function updateUserProfile(chatHistory, oldUserFacts) {
  const recentUserFacts = await userFactsExtracter(chatHistory);
  // 整合新旧 user facts，并返回所有整合后的 user facts
  // updatedUserFacts 应该也要存入数据库
  integrated_User_Facts = await integratedUserFacts(
    oldUserFacts,
    recentUserFacts
  );
  return integrated_User_Facts;
}

// updating object facts:
export async function updateObjectProfile(chatHistory, oldObjectFacts) {
  // chatHistory 是最近的；oldObjectFacts 是之前整合的所有object facts，要从数据库取出调入
  // 先提取最近的object facts
  const recentObjectFacts = await objectFactsExtracter(chatHistory);
  // 整合新旧object facts，并返回所有整合后的object facts
  // updatedObjectFacts应该也要存入数据库
  integrated_Object_Facts = await integratedObjectFacts(
    oldObjectFacts,
    recentObjectFacts
  );
  return integrated_Object_Facts;
}
