'use client';

import { Link } from '@/libs/i18nNavigation';
// 暂时注释掉Clerk相关的导入
// import { useUser, UserButton } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export const UserMenu = () => {
  // 移除Clerk useUser，使用一个简单的替代方案
  // const { isSignedIn, user } = useUser();
  const isSignedIn = false; // 暂时禁用登录状态
  const pathname = usePathname() || '';
  const t = useTranslations('Navigation');

  if (isSignedIn) {
    return (
      <div className="flex items-center">
        <Link 
          href="/dashboard"
          className="mr-3 text-sm hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <span>{t('dashboard')}</span>
        </Link>
        <span className="mr-3 text-sm text-gray-600">
          {"User"}
        </span>
        {/* <UserButton afterSignOutUrl="/" /> */}
        <button className="px-3 py-1.5 text-sm bg-gray-200 rounded-full cursor-pointer">
          U
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link href="/sign-in" className="px-3 py-1.5 text-sm text-gray-700 hover:text-indigo-600 cursor-pointer">
        {t('login')}
      </Link>
    </div>
  );
}; 