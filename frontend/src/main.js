import { createApp } from 'vue'
import router from "./router"
import App from './App.vue'
import mitt from "mitt"

export const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(router);
app.mount('#app');

// 카카오 로그인 API 코드
window.Kakao.init("65de78e65ef73ebd4576e2e2c2a1cafe");
