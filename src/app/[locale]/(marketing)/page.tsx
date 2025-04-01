import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AIToolGrid } from '@/components/AIToolGrid';
import { Navbar } from '@/components/Navbar';
import { Search } from '@/components/Search';
import { recentlyLaunchedTools, featuredTools } from '@/data/mockData';

// 定义一个单独的 Hero 组件，避免导入错误
const Hero = () => {
  return (
    <div className="bg-indigo-50 py-8 px-4 rounded-xl">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          The Best AI Websites and Tools for Developers
        </h1>
        <p className="text-base mb-6 text-gray-700">
          <span className="text-indigo-600 font-medium">25168</span> AIs and <span className="text-indigo-600 font-medium">233</span> categories
        </p>
        <Search />
      </div>
    </div>
  );
};

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: 'AICode.IT - The Best AI Websites and Tools for Independent Developers',
    description: 'Explore the largest AI tools directory. Find the best AI websites and tools updated daily by ChatGPT.',
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Hero />

        <div className="mt-16">
          <AIToolGrid tools={recentlyLaunchedTools} title="Just launched" />
        </div>

        <div className="mt-8">
          <AIToolGrid tools={featuredTools} title="Featured*" />
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/all-tools" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View all AIs
          </a>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 AICode.IT. All rights reserved.</p>
          <p className="mt-2 text-sm">
            The best AI websites and tools directory. Updated daily.
          </p>
        </div>
      </footer>
    </div>
  );
}
