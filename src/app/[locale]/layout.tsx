import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, locales } from '@/i18n';
// 暂时注释掉Clerk相关导入
// import { ClerkProvider } from '@clerk/nextjs';
// import { ptBR, enUS } from '@clerk/localizations';

import '@/styles/global.css';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/assets/images/aicode-favicon.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
  ],
};

// 暂时注释掉Clerk本地化配置
// 根据当前语言获取 Clerk 本地化配置
// const getClerkLocalization = (locale: string) => {
//   switch (locale) {
//     case 'pt-BR':
//       return ptBR;
//     default:
//       return enUS;
//   }
// };

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  
  // Show a 404 error if the user requests an unknown locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages(locale);
  // 暂时注释掉Clerk本地化
  // const localization = getClerkLocalization(locale);

  return (
    <html lang={locale} className="h-full">
      <body className="h-full bg-gray-50">
        {/* 移除ClerkProvider，直接使用NextIntlClientProvider */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
