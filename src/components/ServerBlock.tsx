import { defineComponent, PropType, ref, effect } from 'vue';
import { Battery } from '@/types/api';
import api from '@/requests/api.ts';
import { NThing, NText } from 'naive-ui';
import BatteryIcon from '@/icons/battery.svg';
import BatteryChargedIcon from '@/icons/batteryCharged.svg';

export default defineComponent({
  props: {
    server: { type: Object as PropType<Server>, required: true },
  },
  setup(props) {
    const battery = ref<Battery>();
    const error = ref('');

    effect(async () => {
      try {
        battery.value = await api.battery(props.server.host);
        error.value = '';
      }
      catch (e) {
        error.value = e.message;
      }
    });

    return () => <NThing style={{ margin: '8px 0' }}>
      {{
        header: () => props.server.name,
        'header-extra': () =>
          <div style={{ display: 'flex', 'align-items': 'center' }}>
            {battery.value?.plugged === 'AC' ?
              <BatteryChargedIcon /> :
              <BatteryIcon />}
            {battery.value?.level}
          </div>,
        description: () => props.server.host,
        footer: error.value ? () => <NText type="error">{error.value}</NText> : undefined,
      }}
    </NThing>;
  },
});
