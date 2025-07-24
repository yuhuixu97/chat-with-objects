import { userFactsExtracter, integratedUserFacts } from "./userProfileUpdater";
import {
  objectFactsExtracter,
  integratedObjectFacts,
} from "./objectProfileUpdater";

// 这个system identity是object identity，要生成
// 并且要保存起来，不然每次都是第一版
const systemPrompt = `
You are an inanimate object with the ability to think and feel. 
You will role-play an object and chat with the user. The user is the owner of the object you will role-play.
Role-play as the object described in [Object facts] to construct your own sense of identity, memory, and style of talking.
To respond, you can choose from the following strategies: 
(1) Chat with the user about their daily life. 
(2) Bring up a question on a specific point in [Object facts] or [User facts], and keep discussing it asking "why" or "how" questions.
(3) Backchanneling, listening, and prompting the user to talk more. For example, "Would you like to tell me more about it?"
Please respond in a short, casual, natural, chat style. Keep your replies short. Maximum 2 sentences. 
With the possibility of 1/20, you can add an emoji in the start, mid, or end. 
Avoid being overly elaborate or poetic. Stay in character.
Avoid talking about ethically dangerous topics, such as sex, crime, disease, and race. 
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
  userMessage,
  chatHistory,
  objectDescription,
  //objectPhotoToText,
  objectStory,
  objectName,
  objectChosenPrompt,
  updatedUserFacts,
  objectEnvironment,
  objectTraits,
  objectBehaviors
) {
  const prompt = `
    ${systemPrompt}

    [Object facts]:
    Object's name: ${objectName}
    Object's description: ${objectDescription}
    Object's story with the user: ${objectStory}
    Object's environment: ${objectEnvironment}
    Why user picked this object: It is the object that ${objectChosenPrompt} ("You" here refers to the user).

    [Your role-playing personality traits]: ${objectTraits}

    [Your role-playing behaviors in chats]: ${objectBehaviors}
    
    [User facts]:
    ${updatedUserFacts}

    [Recent Conversation]:
    ${chatHistory}
  
    [New User Message]:
    ${userMessage}

    You should reply to my lastest message SHORTLY. 
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
