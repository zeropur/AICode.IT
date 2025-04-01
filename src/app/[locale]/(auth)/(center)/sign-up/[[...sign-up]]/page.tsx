import { getI18nPath } from '@/utils/Helpers';
import { SignUp } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignUpPageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignUpPage(props: ISignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'SignUp'
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('welcome')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('have_account')}{' '}
            <Link
              href={getI18nPath('/sign-in', locale)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('sign_in')}
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <SignUp
            path={getI18nPath('/sign-up', locale)}
            routing="path"
            signInUrl={getI18nPath('/sign-in', locale)}
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footerAction: "hidden"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
