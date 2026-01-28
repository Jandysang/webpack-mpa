import React from 'react';
import { Button, Space, DatePicker } from 'antd';
import 'antd/dist/reset.css'; // Ant Design 5.x 推荐使用 reset.css

const App= () => {
  const message = 'Hello React!';

  return (
    <div>
      <h1 >{message}</h1>
      <p>React 18 + Webpack5 多页面配置成功！</p>
      <Space>
        <DatePicker />
        <Button type="primary">Primary Button</Button>
      </Space>
    </div>
  );
};

export default App;