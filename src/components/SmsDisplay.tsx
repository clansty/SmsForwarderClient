import { defineComponent, watch, PropType, ref } from 'vue';
import { Sms } from '@/types/api';
import api from '@/requests/api.ts';
import { NCard, NTime, NSpace, NButton, useMessage, NSpin } from 'naive-ui';
import Right from '@/icons/right.svg';
import Left from '@/icons/left.svg';
import Sim from '@/icons/sim.svg';
import { useProgress } from '@marcoschulte/vue3-progress';

export default defineComponent({
  props: {
    server: { type: Object as PropType<Server>, required: true },
  },
  setup(props) {
    const page = ref(1);
    const allLoad = ref(false);
    const load = ref(false);
    const sms = ref<Sms[]>([]);
    const error = ref('');
    const progress = useProgress();
    const message = useMessage();

    watch([() => props.server.host], async () => {
      sms.value = [];
      page.value = 1;
      allLoad.value = false;
      error.value = '';
      await loadPage();
    }, { immediate: true });

    const loadPage = async () => {
      load.value = true;
      try {
        const data = await progress.attach(api.sms(props.server.host, page.value));
        if (data.length === 0) {
          allLoad.value = true;
          message.info('已全部加载');
        }
        sms.value.push(...data);
        error.value = '';
      }
      catch (e: any) {
        message.error(e.message);
      }
      load.value = false;
    };

    const handleInfiniteOnLoad = () => {
      if (allLoad.value) return;
      if (load.value) return;
      console.log('handleInfiniteOnLoad');
      page.value++;
      loadPage();
    };

    return () =>
      <NSpace
        vertical
        v-infinite-scroll={handleInfiniteOnLoad}
        infinite-scroll-distance={50}
      >{
        sms.value.map(it => <NCard title={it.name}>
          {{
            'header-extra': () => <div style={{ display: 'flex', 'align-items': 'center' }}>
              {it.number}
              {it.type === 1 && <Right />}
              {it.type === 2 && <Left />}
              <Sim />
              {it.sim_id === -1 ? '?' : it.sim_id}
            </div>,
            default: () => it.content,
            footer: () => <NTime time={new Date(it.date)} />,
          }}
        </NCard>)
      }
        {load.value && <NSpin style={{ width: '100%' }} />}
      </NSpace>;
  },
});
