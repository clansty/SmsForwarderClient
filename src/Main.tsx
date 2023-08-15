import { defineComponent, ref, computed, PropType } from 'vue';
import { useStorage } from '@vueuse/core';
import {
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  NButton,
  NSpace,
} from 'naive-ui';
import ServerBlock from '@/components/ServerBlock.tsx';
import SmsDisplay from '@/components/SmsDisplay.tsx';
import AddServerForm from '@/components/AddServerForm.tsx';
import SendSmsForm from '@/components/SendSmsForm.tsx';

export default defineComponent({
  setup() {
    const servers = useStorage<Server[]>('servers', []);
    const selectedServerName = ref('');
    const selectedServer = computed(() => servers.value.find(it => it.name === selectedServerName.value));
    const menuOptions = computed(() => servers.value.map(it => ({
      key: it.name,
      label: () => <ServerBlock server={it} />,
    })));
    const addFormShow = ref(false);
    const sendFormShow = ref(false);

    return () => <NLayout position="absolute" has-sider>
      <NLayoutSider content-style="padding: 10px 5px;">
        <NButton
          tertiary
          style={{ margin: '0 8px', width: '-webkit-fill-available' }}
          onClick={() => addFormShow.value = true}
        >添加</NButton>
        <NMenu
          options={menuOptions.value}
          v-model:value={selectedServerName.value}
          style={{ '--n-item-height': 'fit-content' }}
        />
      </NLayoutSider>
      {selectedServerName.value && <NLayoutContent>
        <NSpace vertical style={{ margin: '16px' }}>
          <NSpace>
            <NButton onClick={() => sendFormShow.value = true}>发送短信</NButton>
            <NButton
              onClick={() => {
                servers.value = servers.value.filter(it => it.name !== selectedServerName.value);
                selectedServerName.value = '';
              }}
            >删除</NButton>
          </NSpace>
          <SmsDisplay server={selectedServer.value!} />
        </NSpace>
        <SendSmsForm v-model:show={sendFormShow.value} server={selectedServer.value!} />
      </NLayoutContent>}
      <AddServerForm v-model:show={addFormShow.value} add={server => servers.value.push(server)} />
    </NLayout>;
  },
});
