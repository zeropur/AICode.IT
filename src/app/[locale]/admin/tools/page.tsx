'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { placeholderImage } from '@/utils/imageUtils';
import Link from 'next/link';

// 添加CSS动画样式
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  .toast-enter {
    animation: fadeIn 0.3s ease forwards;
  }
  
  .toast-exit {
    animation: fadeOut 0.3s ease forwards;
  }
`;

// Toast通知类型接口
interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

// 类别类型定义
interface Category {
  id: number;
  name: string;
  description?: string;
}

// 工具类型定义
interface Tool {
  id: number;
  name: string;
  link: string;
  rating: number;
  description: string;
  release_date: string;
  image_url: string;
  category_id: number; // 新增类别ID字段
  category_name?: string; // 用于显示类别名称
}

// 工具管理页面
export default function ToolsAdmin() {
  // 工具数据状态
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 模态窗口状态
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  
  // 类别状态
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });
  
  // 图片预览模态窗口
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');
  
  // Toast通知状态
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    rating: 5,
    description: '',
    release_date: new Date().toISOString(), // 现在包含时分秒
    image_url: '',
    category_id: 0 // 新增类别ID字段
  });
  
  // 图片上传状态
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // 批量删除状态
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // 加载工具数据
  const loadTools = async (query = '', page = 1) => {
    setLoading(true);
    try {
      // 这里假设API支持分页，如果不支持，可以在前端进行分页处理
      const response = await fetch(`/api/tools/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch tools');
      const data = await response.json();
      
      // 计算分页数据
      setTotalItems(data.length);
      setTotalPages(Math.max(1, Math.ceil(data.length / itemsPerPage)));
      
      // 分页处理
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
      
      setTools(paginatedData);
      
      // 如果当前页没有数据但总数据不为空，回到上一页
      if (paginatedData.length === 0 && data.length > 0 && page > 1) {
        setCurrentPage(page - 1);
      }
      
      // 重置选择状态
      setSelectedTools([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 加载类别数据
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      addToast('error', '加载类别失败');
    }
  };
  
  // 初始加载工具和类别
  useEffect(() => {
    loadTools('', currentPage);
    loadCategories();
  }, [currentPage, itemsPerPage]);
  
  // 当分页或每页数量改变时重新加载数据
  useEffect(() => {
    loadTools(searchQuery, currentPage);
  }, [currentPage, itemsPerPage]);
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 搜索时重置到第一页
    loadTools(searchQuery, 1);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // 处理图片预览
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // 创建文件预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // 处理图片上传
  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      console.log('Uploading image:', imageFile.name);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.details || data.error || 'Unknown error';
        console.error('Upload failed:', errorMessage);
        throw new Error(`Upload failed: ${errorMessage}`);
      }
      
      console.log('Upload successful:', data.url);
      addToast('success', '图片上传成功');
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast('error', `图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return null;
    } finally {
      setUploadLoading(false);
    }
  };
  
  // 编辑工具 - 打开模态窗口
  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      link: tool.link,
      rating: tool.rating,
      description: tool.description,
      release_date: new Date(tool.release_date).toISOString(),
      image_url: tool.image_url,
      category_id: tool.category_id || 0
    });
    setPreviewUrl(tool.image_url);
    setShowModal(true);
  };
  
  // 新增工具 - 打开模态窗口
  const handleAddNew = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      link: '',
      rating: 5,
      description: '',
      release_date: new Date().toISOString(),
      image_url: '',
      category_id: 0
    });
    setPreviewUrl('');
    setImageFile(null);
    setShowModal(true);
  };
  
  // 关闭模态窗口
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTool(null);
    setPreviewUrl('');
    setImageFile(null);
  };
  
  // 添加Toast通知
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // 2.7秒后添加退出动画类
    setTimeout(() => {
      const toastElement = document.getElementById(`toast-${id}`);
      if (toastElement) {
        toastElement.classList.add('toast-exit');
      }
    }, 2700);
    
    // 3秒后完全移除
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };
  
  // 保存工具信息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 首先上传图片（如果有新图片）
    let imageUrl = formData.image_url;
    if (imageFile) {
      console.log('Starting image upload process...');
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        console.log('Image URL set:', imageUrl);
      } else {
        console.error('Image upload failed');
        return; // 已在handleImageUpload中显示了错误信息
      }
    }
    
    // 如果没有图片URL，使用占位图
    if (!imageUrl) {
      imageUrl = placeholderImage;
      console.log('Using placeholder image');
    }
    
    // 准备提交的数据
    const toolData = {
      ...formData,
      image_url: imageUrl,
      rating: Number(formData.rating),
      category_id: Number(formData.category_id),
      // 发布日期保持不变，已经是正确的ISO格式包含时分秒
    };
    
    console.log('Submitting tool data:', toolData);
    
    try {
      let response;
      
      if (editingTool) {
        // 更新现有工具
        console.log('Updating existing tool:', editingTool.id);
        response = await fetch(`/api/tools/${editingTool.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toolData)
        });
      } else {
        // 创建新工具
        console.log('Creating new tool');
        response = await fetch('/api/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toolData)
        });
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', result);
        throw new Error(result.error || '保存失败');
      }
      
      console.log('Tool saved successfully:', result);
      
      // 关闭模态窗口
      handleCloseModal();
      
      // 重新加载工具列表
      await loadTools(searchQuery, currentPage);
      
      // 显示成功消息
      addToast('success', editingTool ? '工具更新成功' : '工具添加成功');
      
    } catch (error) {
      console.error('Error saving tool:', error);
      addToast('error', `保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };
  
  // 删除单个工具
  const handleDeleteSingle = async (id: number) => {
    if (!confirm('确定要删除这个工具吗？此操作不可撤销。')) return;
    
    try {
      const response = await fetch(`/api/tools/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete tool');
      
      // 重新加载工具列表
      await loadTools(searchQuery, currentPage);
      
      // 显示成功消息
      addToast('success', '删除成功');
    } catch (error) {
      console.error('Error deleting tool:', error);
      addToast('error', '删除失败');
    }
  };
  
  // 选择/取消选择单个工具
  const handleSelectTool = (id: number) => {
    setSelectedTools(prev => {
      if (prev.includes(id)) {
        return prev.filter(toolId => toolId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // 选择/取消选择所有工具
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTools([]);
    } else {
      setSelectedTools(tools.map(tool => tool.id));
    }
    setSelectAll(!selectAll);
  };
  
  // 批量删除选中的工具
  const handleBatchDelete = async () => {
    if (selectedTools.length === 0) {
      addToast('info', '请至少选择一个工具');
      return;
    }
    
    if (!confirm(`确定要删除已选择的 ${selectedTools.length} 个工具吗？此操作不可撤销。`)) return;
    
    try {
      // 依次删除所有选中的工具
      const deletePromises = selectedTools.map(id => 
        fetch(`/api/tools/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // 重新加载工具列表
      await loadTools(searchQuery, currentPage);
      
      // 重置选择状态
      setSelectedTools([]);
      setSelectAll(false);
      
      // 显示成功消息
      addToast('success', '批量删除成功');
    } catch (error) {
      console.error('Error batch deleting tools:', error);
      addToast('error', '批量删除失败');
    }
  };
  
  // 分页导航 - 上一页
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // 分页导航 - 下一页
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // 查看大图 - 修改为打开预览模态窗口
  const handleViewImage = (url: string, title = '') => {
    // 确保清理可能存在的之前的预览状态
    closeImagePreview();
    
    // 确保url存在，必要时使用占位图
    const imageUrl = url || placeholderImage;
    console.log('Opening image preview:', imageUrl);
    
    // 一定延迟后显示图片，避免某些渲染问题
    setTimeout(() => {
      setPreviewImage(imageUrl);
      setPreviewTitle(title || '图片预览');
    }, 10);
  };
  
  // 关闭图片预览
  const closeImagePreview = () => {
    setPreviewImage(null);
    setPreviewTitle('');
  };
  
  // 编辑类别 - 打开模态窗口
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowCategoryModal(true);
  };
  
  // 新增类别 - 打开模态窗口
  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: ''
    });
    setShowCategoryModal(true);
  };
  
  // 关闭类别模态窗口
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };
  
  // 处理类别表单输入变化
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value
    });
  };
  
  // 保存类别信息
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingCategory) {
        // 更新现有类别
        response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryFormData)
        });
      } else {
        // 创建新类别
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryFormData)
        });
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '保存类别失败');
      }
      
      // 关闭模态窗口
      handleCloseCategoryModal();
      
      // 重新加载类别列表
      await loadCategories();
      
      // 显示成功消息
      addToast('success', editingCategory ? '类别更新成功' : '类别添加成功');
      
    } catch (error) {
      console.error('Error saving category:', error);
      addToast('error', `保存类别失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };
  
  // 删除类别
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('确定要删除这个类别吗？此操作不可撤销。')) return;
    
    try {
      // 检查是否有工具使用此类别
      const toolsResponse = await fetch(`/api/tools/search?category=${id}`);
      const toolsData = await toolsResponse.json();
      
      if (toolsData && toolsData.length > 0) {
        addToast('error', `无法删除：有${toolsData.length}个工具正在使用此类别`);
        return;
      }
      
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      
      // 重新加载类别列表
      await loadCategories();
      
      // 显示成功消息
      addToast('success', '类别删除成功');
    } catch (error) {
      console.error('Error deleting category:', error);
      addToast('error', '删除类别失败');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 添加动画样式 */}
      <style jsx global>{fadeIn}</style>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">工具管理</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAddNewCategory}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          >
            管理类别
          </button>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            返回首页
          </Link>
        </div>
      </div>
      
      {/* 搜索和添加 */}
      <div className="flex justify-between mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="搜索工具名称..."
            className="border border-gray-300 rounded-md px-3 py-2 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            搜索
          </button>
        </form>
        
        <div className="flex gap-2">
          {selectedTools.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              批量删除 ({selectedTools.length})
            </button>
          )}
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            添加新工具
          </button>
        </div>
      </div>
      
      {/* 工具列表 */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图片</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评分</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">加载中...</td>
              </tr>
            ) : tools.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">没有找到工具</td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.id} className={selectedTools.includes(tool.id) ? "bg-blue-50" : ""}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={() => handleSelectTool(tool.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{tool.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button 
                      className="relative group w-16 h-16 border border-gray-200 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500"
                      onClick={() => handleViewImage(tool.image_url || placeholderImage, tool.name)}
                      type="button"
                    >
                      <img 
                        src={tool.image_url || placeholderImage} 
                        alt={tool.name}
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-xs font-bold">点击查看</span>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{tool.description}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{tool.rating}</span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(c => c.id === tool.category_id)?.name || '未分类'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tool.release_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(tool)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(tool.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 分页控件 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            显示 <span className="font-medium">{tools.length}</span> 条记录，共 
            <span className="font-medium"> {totalItems}</span> 条
          </span>
          
          <select
            className="ml-4 border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 重置为第一页
            }}
          >
            <option value="5">5条/页</option>
            <option value="10">10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            上一页
          </button>
          
          <span className="px-3 py-1 text-sm">
            第 <span className="font-medium">{currentPage}</span> 页，共 
            <span className="font-medium"> {totalPages}</span> 页
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            下一页
          </button>
        </div>
      </div>
      
      {/* 图片预览模态窗口 */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-6xl w-auto max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()} // 防止点击内容区域关闭
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {previewTitle || '图片预览'}
              </h3>
              <button
                onClick={closeImagePreview}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-1 transition"
                title="关闭"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-100" style={{ minHeight: '300px', minWidth: '400px' }}>
              <img 
                src={previewImage} 
                alt={previewTitle}
                className="max-w-full max-h-[70vh] object-contain shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                  addToast('error', '图片加载失败');
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 模态窗口 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTool ? '编辑工具' : '添加新工具'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">工具名称 *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">链接 *</label>
                    <input
                      type="url"
                      name="link"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.link}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">评分 (1-5) *</label>
                    <select
                      name="rating"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.rating}
                      onChange={handleInputChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">类别 *</label>
                    <select
                      name="category_id"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.category_id}
                      onChange={handleInputChange}
                    >
                      <option value="0">-- 选择类别 --</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
                    <p className="text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                      {new Date().toLocaleString()} (自动设置为当前时间)
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">图片</label>
                    
                    <div className="flex items-start gap-4">
                      {/* 图片预览 */}
                      {previewUrl && (
                        <button
                          type="button"
                          className="relative group w-32 h-32 border border-gray-200 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500"
                          onClick={() => handleViewImage(previewUrl, formData.name || '图片预览')}
                        >
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderImage;
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-xs font-bold">点击查看大图</span>
                          </div>
                        </button>
                      )}
                      
                      {/* 图片上传 */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={handleImageChange}
                        />
                        {!imageFile && formData.image_url && (
                          <input
                            type="url"
                            name="image_url"
                            placeholder="或输入图片URL"
                            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
                            value={formData.image_url}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    </div>
                    
                    {uploadLoading && <p className="text-sm text-blue-500 mt-1">正在上传图片...</p>}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
                  >
                    {uploadLoading ? '正在上传...' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* 类别管理模态窗口 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategory ? '编辑类别' : '添加新类别'}
              </h3>
              <button
                onClick={handleCloseCategoryModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类别名称 *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseCategoryModal}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    保存
                  </button>
                </div>
              </form>
              
              {/* 现有类别列表 */}
              {categories.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">现有类别</h4>
                  <div className="bg-white shadow overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                          <tr key={category.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                            <td className="px-4 py-4 text-sm text-gray-500">{category.description || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {categories.length === 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                  暂无类别数据，请添加新类别
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast通知 */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 toast-enter ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 