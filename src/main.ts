import { createApp } from 'vue';
import App from './App';
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress';
import infiniteScroll from 'vue3-infinite-scroll-better';

createApp(App)
  .use(Vue3ProgressPlugin)
  .use(infiniteScroll)
  .mount('#app');
