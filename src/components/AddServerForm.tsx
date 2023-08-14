import { computed, defineComponent, PropType, ref } from 'vue';
import { FormInst, NButton, NCard, NForm, NFormItem, NInput, NModal } from 'naive-ui';

export default defineComponent({
  props: {
    show: { type: Boolean },
    add: { type: Function as PropType<(server: Server) => any>, required: true },
  },
  setup(props, { emit }) {
    const show = computed({
      get: () => props.show,
      set: (value) => emit('update:show', value),
    });
    const form = ref({
      name: '',
      host: 'http://',
    });
    const formRef = ref<FormInst>();
    const rules = {
      name: {
        required: true,
        message: '请输入名称',
        trigger: 'blur',
      },
      host: {
        required: true,
        message: '请输入地址',
        trigger: 'blur',
      },
    };
    const save = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          props.add(form.value);
          form.value = {
            name: '',
            host: 'http://',
          };
          show.value = false;
        }
      });
    };

    return () => <NModal
      v-model:show={show.value}
    >
      <NCard
        style="width: 50vw"
        title="添加服务器"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        {{
          default: () => <NForm rules={rules} model={form.value} ref={formRef}>
            <NFormItem label="名称" path="name">
              <NInput
                //@ts-ignore
                vModel:value={form.value.name}
              />
            </NFormItem>
            <NFormItem label="地址" path="host">
              <NInput
                //@ts-ignore
                vModel:value={form.value.host}
              />
            </NFormItem>
          </NForm>,
          footer: () => <NButton onClick={save}>
            确定
          </NButton>,
        }}
      </NCard>
    </NModal>;
  },
});
