// 定义事件类型
export type SearchEventCallback = (query: string) => void;

// 搜索服务单例
class SearchService {
  private listeners: SearchEventCallback[] = [];

  // 注册搜索回调
  public subscribe(callback: SearchEventCallback): () => void {
    this.listeners.push(callback);
    
    // 返回取消订阅函数
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // 触发搜索
  public search(query: string): void {
    this.listeners.forEach(callback => callback(query));
  }
}

// 导出单例
export const searchService = new SearchService(); 