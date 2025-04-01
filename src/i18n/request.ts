import { getRequestConfig } from 'next-intl/server';
import { locales, getMessages } from '../i18n';

export default getRequestConfig(async ({ locale }) => {
  // 验证请求的 locale 是否有效
  if (!locales.includes(locale as any)) {
    return {
      locale: 'en',
      messages: await getMessages('en'),
      timeZone: 'Asia/Shanghai'
    };
  }

  return {
    locale,
    messages: await getMessages(locale),
    timeZone: 'Asia/Shanghai'
  };
}); 