// src/pages/react/App.jsx
import React from 'react';

// 纯React组件
function App() {
  const message = 'Hello React!';
  // ✅ React渲染的是基本类型/React元素，不是Vue对象
  return (
    <div className="react-page">
      <h1>{message}</h1>
      <p>React 18 + Webpack5 多页面配置成功！</p>
    </div>
  );
}

export default App;