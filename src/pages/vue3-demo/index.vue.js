import { createApp } from 'vue';

import ElementPlus from 'element-plus'
import App from './App.vue';


import '@/common/style/common.element.self.css'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app');