
// ✅ 正确写法（引入React组件）
import { createRoot } from 'react-dom/client';
import App from './App.react.jsx'; // 必须是.jsx文件
import './index.self.css'

// 确保root挂载点存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
}

// 渲染React组件（只能是React的JSX/基本类型）
const root = createRoot(document.getElementById('root'));
root.render(<App />);