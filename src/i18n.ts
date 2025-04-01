import { notFound } from 'next/navigation';

// 导出支持的语言列表
export const locales = ['en'];

// 创建一个类型安全的消息获取函数
export async function getMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export const defaultLocale = 'en';

// 根据 next-intl 3.22 的要求，必须正确返回 locale
export function getLocale(locale?: string) {
  if (!locale) return defaultLocale;
  return locales.includes(locale as any) ? locale : defaultLocale;
} 