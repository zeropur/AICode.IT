import { NextRequest, NextResponse } from 'next/server';
import { supabase, adminSupabase } from '@/libs/Supabase';

// 获取单个工具
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*, categories(name)')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch tool' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    // 处理返回数据，转换类别信息
    const processedData = {
      ...data,
      category_name: data.categories?.name || null,
      categories: undefined // 移除嵌套的categories对象
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// 更新工具（仅管理员）
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 这里可以添加认证检查
    // if (!isAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    
    // 确保category_id是数字
    if (body.category_id) {
      body.category_id = Number(body.category_id);
    }
    
    // 添加updated_at字段
    body.updated_at = new Date().toISOString();
    
    const { data, error } = await adminSupabase
      .from('tools')
      .update(body)
      .eq('id', params.id)
      .select('*, categories(name)')
      .single();

    if (error) {
      console.error('Error updating tool:', error);
      return NextResponse.json(
        { error: `Failed to update tool: ${error.message}` },
        { status: 500 }
      );
    }
    
    // 处理返回数据，转换类别信息
    const processedData = {
      ...data,
      category_name: data.categories?.name || null,
      categories: undefined // 移除嵌套的categories对象
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// 删除工具（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 这里可以添加认证检查
    // if (!isAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { error } = await adminSupabase
      .from('tools')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting tool:', error);
      return NextResponse.json(
        { error: `Failed to delete tool: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 