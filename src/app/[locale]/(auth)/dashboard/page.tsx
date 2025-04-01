import { UserButton, currentUser } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function Dashboard(props: {
  params: { locale: string };
}) {
  const { locale } = props.params;
  setRequestLocale(locale);
  
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>You need to be signed in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-3">{user.firstName || user.emailAddresses[0].emailAddress}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.firstName || 'User'}!</h2>
        <p className="text-gray-600 mb-4">
          This is your personal dashboard where you can manage your AI tools preferences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-2">Saved Tools</h3>
            <p className="text-sm text-gray-600">0 items</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-2">Recommendations</h3>
            <p className="text-sm text-gray-600">3 new tools</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-2">Account</h3>
            <p className="text-sm text-gray-600">Settings & preferences</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
        <p className="text-gray-500 text-sm">You haven't viewed any tools yet.</p>
      </div>
    </div>
  );
}
