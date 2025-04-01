'use client';

import { Link } from '@/libs/i18nNavigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export const UserMenu = () => {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname() || '';
  const locale = pathname.split('/')[1] || 'en';
  // @ts-ignore - 暂时忽略类型错误
  const t = useTranslations('Navigation');

  if (isSignedIn && user) {
    return (
      <div className="flex items-center">
        <Link 
          href="/dashboard"
          className="mr-3 text-sm hover:text-indigo-600 transition-colors"
        >
          {/* @ts-ignore - 暂时忽略类型错误 */}
          <span>{t('dashboard')}</span>
        </Link>
        <span className="mr-3 text-sm text-gray-600">
          {user.firstName || (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || 'User'}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link href="/sign-in" className="px-3 py-1.5 text-sm text-gray-700 hover:text-indigo-600">
        {/* @ts-ignore - 暂时忽略类型错误 */}
        {t('login')}
      </Link>
    </div>
  );
}; 