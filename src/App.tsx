import { defineComponent } from 'vue';
import { dateZhCN, NConfigProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui';
import Main from '@/Main.tsx';
import { ProgressBar } from '@marcoschulte/vue3-progress';

export default defineComponent({
  render() {
    return (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NMessageProvider>
          <NNotificationProvider>
            <ProgressBar />
            <Main/>
          </NNotificationProvider>
        </NMessageProvider>
      </NConfigProvider>
    );
  },
});
