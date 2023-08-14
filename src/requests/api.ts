import { Battery, Sms } from '@/types/api';

const baseRequest = async (url: string, body?: any) => {
  const req = await fetch(url, {
    method: 'POST',
    body: body && JSON.stringify(body),
  });
  const res = await req.json() as {
    'timestamp': number,
    'code': number,
    'msg': string,
    data: any
  };
  if (res.code === 200) return res.data;
  else throw new Error(res.msg);
};

export default {
  async battery(host: string) {
    return await baseRequest(host + '/battery/query', {
      'data': {},
      'timestamp': 1652590258638,
      'sign': '',
    }) as Battery;
  },
  async sms(host: string, page = 1) {
    return await baseRequest(host + '/sms/query', {
      'data': {
        page_num: page,
        page_size: 20,
      },
      'timestamp': 1652590258638,
      'sign': '',
    }) as Sms[];
  },
  async sendSms(host: string, form: any) {
    return await baseRequest(host + '/sms/send', {
      'data': form,
      'timestamp': 1652590258638,
      'sign': '',
    }) as string;
  },
};
