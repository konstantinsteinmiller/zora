import { createApp } from 'vue'
import '#/css/index.sass'
import '#/css/glass.sass'
import router from '@/router'
import App from '@/App.vue'
// import { useRoute } from "vue-router"
//
// const route = useRoute()
// window.route = route

const app = createApp(App)
app.use(router)
app.mount('#app')
