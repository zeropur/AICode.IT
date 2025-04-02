import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/libs/Supabase';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // 获取文件的Buffer
    const fileBuffer = await file.arrayBuffer();
    
    // 创建唯一文件名
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `tools/${fileName}`;  // 使用更简单的路径
    
    // 检查bucket是否存在，不存在则创建
    try {
      const { data: buckets } = await adminSupabase
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'tools');
      
      if (!bucketExists) {
        console.log('Creating tools bucket...');
        const { error: createBucketError } = await adminSupabase
          .storage
          .createBucket('tools', { public: true });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return NextResponse.json({ error: 'Failed to create storage bucket' }, { status: 500 });
        }
      }
    } catch (bucketError) {
      console.error('Error checking buckets:', bucketError);
    }

    // 上传到Supabase Storage
    console.log('Attempting to upload file to tools bucket:', filePath);
    const { data, error } = await adminSupabase
      .storage
      .from('tools')  // 使用更简单的bucket名称
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true  // 如果文件存在，则覆盖
      });

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ 
        error: 'Failed to upload file',
        details: error.message
      }, { status: 500 });
    }

    console.log('File uploaded successfully:', data);

    // 获取公共URL
    const { data: { publicUrl } } = adminSupabase
      .storage
      .from('tools')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrl);

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      path: filePath
    });

  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 