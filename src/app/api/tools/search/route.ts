import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/libs/Supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const categoryId = searchParams.get('category');
    
    let supabaseQuery = supabase
      .from('tools')
      .select('*, categories(name)')
      .order('id');
    
    // 如果有查询参数，添加模糊搜索条件
    if (query) {
      supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }
    
    // 如果有类别参数，添加类别筛选
    if (categoryId && !isNaN(parseInt(categoryId))) {
      supabaseQuery = supabaseQuery.eq('category_id', parseInt(categoryId));
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) {
      console.error('Error searching tools:', error);
      return NextResponse.json(
        { error: 'Failed to search tools' },
        { status: 500 }
      );
    }
    
    // 处理返回数据，转换类别信息
    const processedData = data.map(tool => ({
      ...tool,
      category_name: tool.categories?.name || null,
      categories: undefined // 移除嵌套的categories对象
    }));
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 