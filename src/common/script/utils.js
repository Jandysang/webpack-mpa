// export const formatUrl = urlStr => {
//   if (!(typeof urlStr === "string" && urlStr.length)) urlStr = window.location.href;
//   var reg = /(?:[?&]+)([^&]+)=([^&]+)/g;
//   var data = {};

//   function fn(str, pro, value) {
//     data[decodeURIComponent(pro)] = decodeURIComponent(value);
//   }
//   urlStr.replace(reg, fn);
//   return data;
// }

export const formatUrl = urlStr => {
  // 1. 处理默认值（使用当前页面URL）
  if (!(typeof urlStr === "string" && urlStr.length)) {
    urlStr = window.location.href;
  }

  // 2. 关键修复：截取 # 之前的部分，忽略锚点内容
  urlStr = urlStr.split('#')[0];

  // 3. 正则匹配查询参数（保持原逻辑不变）
  const reg = /(?:[?&]+)([^&]+)=([^&]+)/g;
  const data = {};

  const fn = (str, pro, value) => {
    data[decodeURIComponent(pro)] = decodeURIComponent(value);
  };

  urlStr.replace(reg, fn);
  return data;
};



export const typeDeepOf = (obj) => {
  if (typeof obj !== "object") return typeof obj;
  return Object.prototype.toString
    .apply(obj)
    .slice(8, -1)
    .toLowerCase();
}