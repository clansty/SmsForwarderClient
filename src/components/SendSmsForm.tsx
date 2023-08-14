import { computed, defineComponent, PropType, ref } from 'vue';
import {
  FormInst,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NRadioButton,
  NRadioGroup,
  NSpin,
  useMessage,
} from 'naive-ui';
import api from '@/requests/api.ts';
import { useProgress } from '@marcoschulte/vue3-progress';

export default defineComponent({
  props: {
    show: { type: Boolean },
    server: { type: Object as PropType<Server>, required: true },
  },
  setup(props, { emit }) {
    const progress = useProgress();
    const message = useMessage();
    const load = ref(false);
    const show = computed({
      get: () => props.show,
      set: (value) => emit('update:show', value),
    });
    const form = ref({
      sim_slot: 1,
      phone_numbers: '',
      msg_content: '',
    });
    const formRef = ref<FormInst>();
    const rules = {
      phone_numbers: {
        required: true,
        message: '请输入收件人',
        trigger: 'blur',
      },
      msg_content: {
        required: true,
        message: '请输入内容',
        trigger: 'blur',
      },
    };
    const save = () => {
      formRef.value?.validate(async errors => {
        if (!errors) {
          load.value = true;
          try {
            const res = await progress.attach(api.sendSms(props.server.host, form.value));
            message.success(res);
            show.value = false;
          }
          catch (e) {
            message.error(e.message);
          }
          load.value = false;
        }
      });
    };

    return () => <NModal
      v-model:show={show.value}
    >
      <NSpin show={load.value}>
        <NCard
          style="width: 50vw"
          title="发送短信"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          {{
            default: () => <NForm rules={rules} model={form.value} ref={formRef}>
              <NFormItem label="卡槽" path="sim_slot">
                <NRadioGroup v-model:value={form.value.sim_slot}>
                  <NRadioButton value={1} label="1" />
                  <NRadioButton value={2} label="2" />
                </NRadioGroup>
              </NFormItem>
              <NFormItem label="收件人" path="phone_numbers">
                <NInput
                  //@ts-ignore
                  vModel:value={form.value.phone_numbers}
                />
              </NFormItem>
              <NFormItem label="内容" path="msg_content">
                <NInput
                  type="textarea"
                  //@ts-ignore
                  vModel:value={form.value.msg_content}
                />
              </NFormItem>
            </NForm>,
            footer: () => <NButton onClick={save}>
              发送
            </NButton>,
          }}
        </NCard>
      </NSpin>
    </NModal>;
  },
});
