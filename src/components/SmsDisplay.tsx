import { defineComponent, effect, PropType, ref } from 'vue';
import { Sms } from '@/types/api';
import api from '@/requests/api.ts';
import { NCard, NTime, NSpace, NButton } from 'naive-ui';
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
    const sms = ref<Sms[]>([]);
    const error = ref('');
    const progress = useProgress();

    effect(async () => {
      try {
        sms.value = await progress.attach(api.sms(props.server.host, page.value));
        error.value = '';
      }
      catch (e: any) {
        error.value = e.message;
      }
    });

    return () =>
      <NSpace vertical>{
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
        <NSpace align="center">
          <NButton disabled={page.value < 2} onClick={() => page.value--}><Left /></NButton>
          {page.value}
          <NButton onClick={() => page.value++}><Right /></NButton>
        </NSpace>
      </NSpace>;
  },
});
