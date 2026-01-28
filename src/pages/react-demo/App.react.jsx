// src/pages/react/App.jsx
import React from 'react';

import { Button, Space, DatePicker } from 'antd';

import styles from './app.module.css';
import 'antd/dist/antd.css';

// 纯React组件
function App() {
  const message = 'Hello React!';
  // ✅ React渲染的是基本类型/React元素，不是Vue对象
  return (
    <div className="react-page">
      <h1 className={styles.title}>{message}</h1>
      <p>React 18 + Webpack5 多页面配置成功！</p>
       <Space>
      <DatePicker />
      <Button type="primary">Primary Button</Button>
    </Space>
    </div>
  );
}

export default App;