import { NextRequest, NextResponse } from 'next/server';
import { supabase, adminSupabase } from '@/libs/Supabase';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category');
    
    // 验证分页参数
    const validPage = page > 0 ? page : 1;
    const validPageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 10;
    
    // 计算偏移量
    const offset = (validPage - 1) * validPageSize;
    
    // 构建查询
    let query = supabase
      .from('tools')
      .select('*, categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false });
      
    // 如果有类别参数，按类别筛选
    if (category) {
      query = query.eq('category_id', category);
    }
    
    // 应用分页
    query = query.range(offset, offset + validPageSize - 1);
    
    // 执行查询
    const { data: tools, error, count } = await query;

    if (error) {
      throw error;
    }
    
    // 处理返回数据，转换类别信息
    const processedData = tools?.map(tool => ({
      ...tool,
      category_name: tool.categories?.name || null,
      categories: undefined // 移除嵌套的categories对象
    })) || [];

    return NextResponse.json({
      data: processedData,
      pagination: {
        total: count || 0,
        page: validPage,
        pageSize: validPageSize,
        pageCount: count ? Math.ceil(count / validPageSize) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

// 创建新工具（仅管理员）
export async function POST(request: NextRequest) {
  try {
    // 这里可以添加认证检查
    // if (!isAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    
    // 验证必填字段
    const requiredFields = ['name', 'link', 'rating', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // 确保有release_date，如果没有则设置为当前时间
    if (!body.release_date) {
      body.release_date = new Date().toISOString();
    }
    
    // 确保有image_url，如果没有则设置为默认图片
    if (!body.image_url) {
      body.image_url = '/images/placeholder.png'; // 使用默认占位图
    }
    
    // 确保category_id是数字
    if (body.category_id) {
      body.category_id = Number(body.category_id);
    }
    
    // 添加created_at和updated_at字段
    const now = new Date().toISOString();
    body.created_at = now;
    body.updated_at = now;

    const { data, error } = await adminSupabase
      .from('tools')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Error inserting tool:', error);
      return NextResponse.json(
        { error: `Failed to create tool: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 