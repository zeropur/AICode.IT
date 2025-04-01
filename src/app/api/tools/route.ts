import { NextRequest, NextResponse } from 'next/server';
import { supabase, adminSupabase } from '@/libs/Supabase';

export async function GET() {
  try {
    // 使用Supabase查询工具表
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    return NextResponse.json(tools);
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
    const requiredFields = ['name', 'link', 'rating', 'description', 'release_date', 'image_url'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await adminSupabase
      .from('tools')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create tool' },
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