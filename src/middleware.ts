// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// 创建国际化中间件
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// 暂时禁用保护路由功能
// 如果需要保护管理员路由，可以添加以下代码
// const protectedAdminRoutes = createRouteMatcher([
//   '/admin(.*)',
//   ...locales.flatMap(locale => [`/${locale}/admin(.*)`])
// ]);

// 只使用国际化中间件，暂时禁用Clerk身份验证
export default intlMiddleware;

// 原始代码 - 暂时禁用
// export default clerkMiddleware(async (auth, req) => {
//   // 保护需要认证的路由
//   if (protectedRoutes(req)) {
//     const session = await auth();
//     if (!session.userId) {
//       const signInUrl = new URL('/sign-in', req.url);
//       signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
//       return Response.redirect(signInUrl);
//     }
//   }
//   
//   // 应用国际化中间件
//   return intlMiddleware(req);
// });

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件
    '/((?!api|_next|.*\\..*).*)'],
};
