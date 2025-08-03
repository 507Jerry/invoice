import { useState, useEffect } from 'react';

/**
 * 响应式媒体查询Hook
 * @param {string} query - 媒体查询字符串
 * @returns {boolean} - 是否匹配查询条件
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 设置初始值
    setMatches(media.matches);

    // 创建事件监听器
    const listener = (event) => {
      setMatches(event.matches);
    };

    // 添加事件监听器
    media.addEventListener('change', listener);

    // 清理函数
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

/**
 * 屏幕尺寸检测Hook
 * @returns {object} - 包含各种屏幕尺寸状态的对象
 */
export const useScreenSize = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');
  const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
  const isSmallScreen = useMediaQuery('(min-width: 480px) and (max-width: 767px)');
  const isTinyScreen = useMediaQuery('(max-width: 479px)');

  return {
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    isTinyScreen,
    isMobile: isSmallScreen || isTinyScreen,
    isDesktop: isLargeScreen || isMediumScreen
  };
}; 