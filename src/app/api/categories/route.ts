import { supabase, adminSupabase } from '@/libs/Supabase';
import { NextResponse } from 'next/server';

// 获取所有类别
export async function GET() {
  try {
    // 查询所有类别，按名称排序
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in categories GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// 创建新类别
export async function POST(request: Request) {
  try {
    // 获取请求body
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // 插入新类别
    const { data, error } = await adminSupabase
      .from('categories')
      .insert([
        {
          name: body.name.trim(),
          description: body.description || null
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in categories POST:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 