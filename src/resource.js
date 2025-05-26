// 定义 resourceId 变量
let resourceId = "uac633de71b774f31";

// 设置 resourceId 的值
export const setResourceId = (id) => {
  resourceId = id; // 设置 resourceId
  localStorage.setItem("resource_id", resourceId); // 设置 resourceId 并存入 localStorage
  console.log("Set resourceId: ", resourceId);
};

// 获取 resourceId 的值
export const getResourceId = () => {
  const id = localStorage.getItem("resource_id") || resourceId;
  console.log("ResourceId returned: ", id);
  return id;
};
