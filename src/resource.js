// 定义 resourceId 变量
// 这里因为默认设置为了开发者账户 P001，导致之后不同设备访问都直接进入这个账户了。
//let resourceId = "uac633de71b774f31";
let resourceId = "";

// 设置 resourceId 的值
export const setResourceId = (id) => {
  resourceId = id; // 设置 resourceId
  localStorage.setItem("resource_id", resourceId); // 设置 resourceId 并存入 localStorage
  console.log("Set resourceId: ", resourceId);
};

export const clearResourceId = () => {
  localStorage.removeItem("resource_id");
  console.log("resource_id removed from localStorage.");
};

// 获取 resourceId 的值
export const getResourceId = () => {
  //const id = localStorage.getItem("resource_id") || resourceId;
  const id = localStorage.getItem("resource_id"); // 从设备本地储存里找，而不是本.js文件的resource_id
  if (!id) {
    console.warn("No resourceId, please login first.");
    // window.location.href = "/LoginPage"; // 未登录自动跳转。去chatlist page里做跳转
    return null;
  }
  console.log("ResourceId returned: ", id);
  return id;
};
