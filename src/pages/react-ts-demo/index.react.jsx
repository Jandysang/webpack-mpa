import { createRoot } from 'react-dom/client';
import App from './App.react.tsx'; // 必须是.jsx文件

// 确保root挂载点存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
}

// 渲染React组件（只能是React的JSX/基本类型）
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Failed to find the root element');
}

