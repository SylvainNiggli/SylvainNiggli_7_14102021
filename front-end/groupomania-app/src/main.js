import { createApp } from 'vue'
import AuthWrapper from "./components/AuthWrapper.vue";
//import App from './App.vue'
import router from './router'

createApp(AuthWrapper).use(router).mount('#app')
