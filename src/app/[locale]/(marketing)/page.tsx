import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AIToolGrid } from '@/components/AIToolGrid';
import { Navbar } from '@/components/Navbar';
import { Search } from '@/components/Search';
import { featuredTools } from '@/data/mockData';
import { ApiToolsGrid } from '@/components/ApiToolsGrid';

// 定义一个单独的 Hero 组件，避免导入错误
const Hero = ({ t }: { t: any }) => {
  return (
    <div className="bg-indigo-50 py-8 px-4 rounded-xl">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {t('hero_title')}
        </h1>
        <p className="text-base mb-6 text-gray-700">
          <span className="text-indigo-600 font-medium">25168</span> {t('hero_stats', { count_ai: 25168, count_categories: 233 })}
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
  // @ts-ignore - 忽略类型错误
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    // @ts-ignore - 忽略类型错误
    title: t('title'),
    // @ts-ignore - 忽略类型错误
    description: t('description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  
  // @ts-ignore - 忽略类型错误
  const t = await getTranslations('Index');
  // @ts-ignore - 忽略类型错误
  const t_grid = await getTranslations('AIToolGrid');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Hero t={t} />

        {/* 使用 ApiToolsGrid 组件替换 Just launched 部分 */}
        <div className="mt-16">
          <ApiToolsGrid />
        </div>

        <div className="mt-8">
          {/* @ts-ignore - 忽略类型错误 */}
          <AIToolGrid tools={featuredTools} title={`${t_grid('featured')}*`} />
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/all-tools" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {/* @ts-ignore - 忽略类型错误 */}
            {t('view_all')}
          </a>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          {/* @ts-ignore - 忽略类型错误 */}
          <p>{t('footer_copyright')}</p>
          <p className="mt-2 text-sm">
            {/* @ts-ignore - 忽略类型错误 */}
            {t('footer_description')}
          </p>
        </div>
      </footer>
    </div>
  );
} 