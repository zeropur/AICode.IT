import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/components/Navbar';
import { Search } from '@/components/Search';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import { supabase } from '@/libs/Supabase';
import ClientWrapper from '@/components/ClientWrapper';
import { getViewAllTranslation } from './actions';

// 定义一个异步函数来获取工具和类别的总数
async function getToolsAndCategoriesCount() {
  try {
    // 获取工具总数
    const { count: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    // 获取类别总数  
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (toolsError || categoriesError) {
      console.error('Error fetching counts:', toolsError || categoriesError);
      return { toolsCount: 0, categoriesCount: 0 };
    }

    return { 
      toolsCount: toolsCount || 0, 
      categoriesCount: categoriesCount || 0 
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return { toolsCount: 0, categoriesCount: 0 };
  }
}

// 获取所有类别数据
async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// 静态类别列表（备用数据）
const defaultCategories = [
  { id: 1, name: 'Text&Writing', slug: 'text-writing' },
  { id: 2, name: 'Image', slug: 'image' },
  { id: 3, name: 'Video', slug: 'video' },
  { id: 4, name: 'Code&IT', slug: 'code-it' },
  { id: 5, name: 'Voice', slug: 'voice' },
  { id: 6, name: 'Business', slug: 'business' },
  { id: 7, name: 'Marketing', slug: 'marketing' },
  { id: 8, name: 'AI Detector', slug: 'ai-detector' },
  { id: 9, name: 'Chatbot', slug: 'chatbot' },
  { id: 10, name: 'Design&Art', slug: 'design-art' },
  { id: 11, name: 'Life Assistant', slug: 'life-assistant' },
  { id: 12, name: '3D', slug: '3d' },
  { id: 13, name: 'Education', slug: 'education' }
];

// 使用server component获取数据的Hero组件
const Hero = async ({ locale }: { locale: string }) => {
  const { toolsCount, categoriesCount } = await getToolsAndCategoriesCount();
  const categories = await getAllCategories();
  
  // 使用数据库中的类别，如果为空则使用默认类别
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  
  // 获取翻译
  // @ts-ignore - 忽略类型错误
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });
  
  // 获取"查看全部"按钮的文本
  const viewAllText = await getViewAllTranslation(locale);
  
  // 基于当前语言区域生成正确的文本
  let statsDisplay;
  if (locale === 'en') {
    statsDisplay = (
      <>
        <span className="text-indigo-600 font-medium">{toolsCount}</span>
        {' Tools and '}
        <span className="text-indigo-600 font-medium">{categoriesCount}</span>
        {' categories'}
      </>
    );
  } else if (locale === 'es') {
    statsDisplay = (
      <>
        <span className="text-indigo-600 font-medium">{toolsCount}</span>
        {' Herramientas y '}
        <span className="text-indigo-600 font-medium">{categoriesCount}</span>
        {' categorías'}
      </>
    );
  } else if (locale === 'zh-CN') {
    statsDisplay = (
      <>
        <span className="text-indigo-600 font-medium">{toolsCount}</span>
        {' 个工具和 '}
        <span className="text-indigo-600 font-medium">{categoriesCount}</span>
        {' 个分类'}
      </>
    );
  } else {
    // 默认回退到英文
    statsDisplay = (
      <>
        <span className="text-indigo-600 font-medium">{toolsCount}</span>
        {' Tools and '}
        <span className="text-indigo-600 font-medium">{categoriesCount}</span>
        {' categories'}
      </>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 py-8 px-4 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {/* @ts-ignore - 忽略类型错误 */}
            {t('hero_title')}
          </h1>
          <p className="text-base mb-6 text-gray-700">
            {statsDisplay}
          </p>
          <Search />
        </div>
      </div>
      
      {/* 客户端包装器，使用字符串值而不是函数 */}
      <ClientWrapper 
        categories={displayCategories}
        viewAllText={viewAllText}
      />
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* 使用异步Hero组件 */}
        <Hero locale={locale} />
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