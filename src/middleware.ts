import createMiddleware from 'next-intl/middleware';

// 只保留国际化中间件，放弃Clerk身份验证中间件
export default createMiddleware({
  locales: ['en', 'es', 'zh-CN'],
  defaultLocale: 'en'
});

export const config = {
  // 跳过所有静态资源和内部路由
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
