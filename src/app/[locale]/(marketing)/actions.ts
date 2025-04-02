'use server';

import { getTranslations } from 'next-intl/server';

// 获取翻译的服务器操作
export async function getViewAllTranslation(locale: string) {
  // @ts-ignore - 忽略类型错误
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });
  // @ts-ignore - 忽略类型错误
  return t('view_all');
} 