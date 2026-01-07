<template>
  <div class="vue3-page">
    <h1>Vue3 Page (Latest Version)</h1>
    <p>{{ message }}</p>
    <button @click="changeMessage">点击修改</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const message = ref('Vue3组合式API生效！');
const changeMessage = () => {
  message.value = 'Vue3 + Webpack5 MPA 成功！';
};
</script>

<style scoped>
.vue3-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
h1 {
  color: #42b983;
}
</style>