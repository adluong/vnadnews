import React, { useState, useEffect, useCallback } from 'react';

// Korean News to Vietnamese Translator
// Uses RSS feeds and translation API for real-time news

const NEWS_SOURCES = [
  { id: 'yonhap', name: 'Yonhap News', nameVi: 'Tin Yonhap', icon: '📰' },
  { id: 'kbs', name: 'KBS World', nameVi: 'KBS World', icon: '📺' },
  { id: 'arirang', name: 'Arirang', nameVi: 'Arirang', icon: '🌏' },
  { id: 'koreaherald', name: 'Korea Herald', nameVi: 'Korea Herald', icon: '📋' },
];

// Mock news data (in production, replace with actual RSS/API calls)
const SAMPLE_NEWS = {
  yonhap: [
    { id: 1, titleKo: '한국 경제 성장률 전망 상향 조정', titleVi: 'Điều chỉnh tăng dự báo tăng trưởng kinh tế Hàn Quốc', date: '2025-01-13', category: 'Kinh tế' },
    { id: 2, titleKo: '서울시, 새해 문화 행사 계획 발표', titleVi: 'Seoul công bố kế hoạch sự kiện văn hóa năm mới', date: '2025-01-13', category: 'Văn hóa' },
    { id: 3, titleKo: '한류 콘텐츠 수출 사상 최대 기록', titleVi: 'Xuất khẩu nội dung Hallyu đạt kỷ lục cao nhất mọi thời đại', date: '2025-01-12', category: 'Giải trí' },
  ],
  kbs: [
    { id: 4, titleKo: '겨울철 한파 주의보 발령', titleVi: 'Cảnh báo giá rét mùa đông được ban hành', date: '2025-01-13', category: 'Thời tiết' },
    { id: 5, titleKo: '국가대표 축구팀 아시안컵 준비', titleVi: 'Đội tuyển bóng đá quốc gia chuẩn bị cho Asian Cup', date: '2025-01-12', category: 'Thể thao' },
  ],
  arirang: [
    { id: 6, titleKo: '한국 관광 산업 회복세 지속', titleVi: 'Ngành du lịch Hàn Quốc tiếp tục phục hồi', date: '2025-01-13', category: 'Du lịch' },
    { id: 7, titleKo: '신기술 스타트업 투자 증가', titleVi: 'Đầu tư vào startup công nghệ mới tăng', date: '2025-01-12', category: 'Công nghệ' },
  ],
  koreaherald: [
    { id: 8, titleKo: '한-베트남 경제 협력 강화', titleVi: 'Tăng cường hợp tác kinh tế Hàn Quốc-Việt Nam', date: '2025-01-13', category: 'Quốc tế' },
    { id: 9, titleKo: 'K-푸드 세계적 인기 상승', titleVi: 'K-Food ngày càng phổ biến trên toàn cầu', date: '2025-01-12', category: 'Ẩm thực' },
  ],
};

// Translation function using Claude API
async function translateText(text, fromLang = 'ko', toLang = 'vi') {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Translate the following Korean text to Vietnamese. Only return the translation, nothing else:\n\n${text}`
        }]
      })
    });
    const data = await response.json();
    return data.content[0]?.text || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// News Card Component
function NewsCard({ news, isTranslating }) {
  return (
    <div className="news-card">
      <div className="card-category">{news.category}</div>
      <h3 className="card-title-vi">{news.titleVi}</h3>
      <p className="card-title-ko">{news.titleKo}</p>
      <div className="card-footer">
        <span className="card-date">{news.date}</span>
        {isTranslating && <span className="translating-badge">⟳ Đang dịch...</span>}
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="news-card skeleton">
      <div className="skeleton-category"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
      <div className="skeleton-footer"></div>
    </div>
  );
}

// Main App Component
export default function KoreanNewsVN() {
  const [activeSource, setActiveSource] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch and combine news from all sources
  const fetchNews = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let allNews = [];
    if (activeSource === 'all') {
      Object.values(SAMPLE_NEWS).forEach(sourceNews => {
        allNews = [...allNews, ...sourceNews];
      });
    } else {
      allNews = SAMPLE_NEWS[activeSource] || [];
    }
    
    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setNews(allNews);
    setLastUpdate(new Date());
    setLoading(false);
  }, [activeSource]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchNews();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchNews, 60000); // Refresh every minute
    }
    
    return () => clearInterval(interval);
  }, [fetchNews, autoRefresh]);

  return (
    <div className="app-container">
      {/* Background Pattern */}
      <div className="bg-pattern"></div>
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">한</span>
            <div className="logo-text">
              <h1>Tin Tức Hàn Quốc</h1>
              <p>Korean News • Dịch sang Tiếng Việt</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className={`refresh-btn ${loading ? 'spinning' : ''}`}
              onClick={fetchNews}
              disabled={loading}
            >
              ↻
            </button>
            <label className="auto-refresh-toggle">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Tự động cập nhật</span>
            </label>
          </div>
        </div>
      </header>

      {/* Source Tabs */}
      <nav className="source-tabs">
        <button 
          className={`tab ${activeSource === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSource('all')}
        >
          <span className="tab-icon">🌐</span>
          <span>Tất cả</span>
        </button>
        {NEWS_SOURCES.map(source => (
          <button
            key={source.id}
            className={`tab ${activeSource === source.id ? 'active' : ''}`}
            onClick={() => setActiveSource(source.id)}
          >
            <span className="tab-icon">{source.icon}</span>
            <span>{source.nameVi}</span>
          </button>
        ))}
      </nav>

      {/* Status Bar */}
      <div className="status-bar">
        <span className="status-update">
          Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
        </span>
        <span className="status-count">
          {news.length} tin tức
        </span>
      </div>

      {/* News Grid */}
      <main className="news-grid">
        {loading ? (
          Array(6).fill(0).map((_, i) => <LoadingSkeleton key={i} />)
        ) : news.length > 0 ? (
          news.map(item => (
            <NewsCard key={item.id} news={item} />
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Không có tin tức</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>🇰🇷 → 🇻🇳 Dịch tự động bằng AI</p>
        <p className="footer-note">Nguồn: Yonhap, KBS, Arirang, Korea Herald</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          --primary: #1a1a2e;
          --secondary: #16213e;
          --accent: #e94560;
          --accent-soft: #ff6b6b;
          --text: #edf2f4;
          --text-muted: #8d99ae;
          --card-bg: rgba(26, 26, 46, 0.85);
          --border: rgba(233, 69, 96, 0.2);
          
          min-height: 100vh;
          font-family: 'Be Vietnam Pro', 'Noto Sans KR', sans-serif;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          color: var(--text);
          position: relative;
          overflow-x: hidden;
        }

        .bg-pattern {
          position: fixed;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(233, 69, 96, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(233, 69, 96, 0.05) 0%, transparent 40%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e94560' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 15, 26, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--accent), var(--accent-soft));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 20px rgba(233, 69, 96, 0.3);
        }

        .logo-text h1 {
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--text), var(--accent-soft));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text p {
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .refresh-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--accent);
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: var(--accent);
          color: white;
          transform: scale(1.05);
        }

        .refresh-btn.spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .auto-refresh-toggle input {
          accent-color: var(--accent);
          width: 16px;
          height: 16px;
        }

        /* Source Tabs */
        .source-tabs {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
          position: relative;
          z-index: 1;
        }

        .source-tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 50px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .tab:hover {
          border-color: var(--accent);
          color: var(--text);
        }

        .tab.active {
          background: linear-gradient(135deg, var(--accent), var(--accent-soft));
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        /* Status Bar */
        .status-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem 1rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          position: relative;
          z-index: 1;
        }

        /* News Grid */
        .news-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.2rem;
          position: relative;
          z-index: 1;
        }

        .news-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .news-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .news-card:hover {
          transform: translateY(-4px);
          border-color: rgba(233, 69, 96, 0.4);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .news-card:hover::before {
          opacity: 1;
        }

        .card-category {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: rgba(233, 69, 96, 0.15);
          color: var(--accent-soft);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.8rem;
        }

        .card-title-vi {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 0.6rem;
          color: var(--text);
        }

        .card-title-ko {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-family: 'Noto Sans KR', sans-serif;
          line-height: 1.5;
          padding-left: 0.8rem;
          border-left: 2px solid var(--border);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .card-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .translating-badge {
          font-size: 0.75rem;
          color: var(--accent);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Skeleton Loading */
        .news-card.skeleton {
          pointer-events: none;
        }

        .skeleton-category,
        .skeleton-title,
        .skeleton-subtitle,
        .skeleton-footer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-category {
          width: 80px;
          height: 24px;
          margin-bottom: 0.8rem;
        }

        .skeleton-title {
          height: 24px;
          margin-bottom: 0.5rem;
        }

        .skeleton-subtitle {
          height: 40px;
          margin-bottom: 1rem;
        }

        .skeleton-footer {
          height: 20px;
          width: 120px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        /* Footer */
        .footer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          text-align: center;
          border-top: 1px solid var(--border);
          position: relative;
          z-index: 1;
        }

        .footer p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.3rem;
        }

        .footer-note {
          font-size: 0.75rem !important;
          opacity: 0.6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .logo {
            flex-direction: column;
            gap: 0.5rem;
          }

          .logo-text {
            text-align: center;
          }

          .news-grid {
            grid-template-columns: 1fr;
          }

          .source-tabs {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
