import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// 创建国际化中间件
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// 创建需要保护的路由匹配器
const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  ...locales.flatMap(locale => [`/${locale}/dashboard(.*)`])
]);

// 整合 Clerk 和 Intl 中间件
export default clerkMiddleware(async (auth, req) => {
  // 保护需要认证的路由
  if (protectedRoutes(req)) {
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return Response.redirect(signInUrl);
    }
  }
  
  // 应用国际化中间件
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件
    '/((?!api|_next|.*\\..*).*)'],
};
