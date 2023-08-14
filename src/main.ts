import { createApp } from 'vue';
import App from './App';
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress';

createApp(App)
  .use(Vue3ProgressPlugin)
  .mount('#app');
