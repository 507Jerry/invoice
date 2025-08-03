import React, { useState, useEffect } from 'react';
import { useScreenSize } from './hooks/useMediaQuery';
import { getDefaultInvoiceData } from './utils/invoiceUtils';
import { generatePDF, isInIframe } from './utils/pdfGenerator';
import { zh } from './locales/zh';
import { en } from './locales/en';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import './App.css';

/**
 * 主应用组件
 */
const App = () => {
  // 屏幕尺寸检测
  const { isLargeScreen, isMediumScreen, isSmallScreen, isTinyScreen, isMobile } = useScreenSize();
  
  // 发票数据状态
  const [invoiceData, setInvoiceData] = useState(() => {
    // 从localStorage加载数据，如果没有则使用默认数据
    const savedData = localStorage.getItem('invoice_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // 转换日期字符串为Date对象
        parsed.invoice.date = new Date(parsed.invoice.date);
        parsed.invoice.dueDate = new Date(parsed.invoice.dueDate);
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved invoice data:', error);
        return getDefaultInvoiceData();
      }
    }
    return getDefaultInvoiceData();
  });

  // 预览显示状态
  const [showPreview, setShowPreview] = useState(true);

  // 当前语言
  const language = invoiceData.language || 'zh';
  
  // 翻译对象
  const translations = language === 'zh' ? zh : en;

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('invoice_data', JSON.stringify(invoiceData));
  }, [invoiceData]);

  /**
   * 重置表单
   */
  const handleReset = () => {
    if (window.confirm(translations.resetForm + '?')) {
      setInvoiceData({
        ...getDefaultInvoiceData(),
        language: invoiceData.language // 保留当前语言
      });
    }
  };

  /**
   * 生成PDF
   */
  const handleGeneratePDF = () => {
    try {
      // 检查是否在iframe中
      const inIframe = isInIframe();
      if (inIframe) {
        console.log('检测到应用运行在iframe中，使用兼容模式');
        
        // 在iframe中，提示用户
        const choice = confirm(
          '检测到您在iframe中运行应用。\n\n' +
          'PDF下载可能被阻止。\n' +
          '点击"确定"尝试下载，或点击"取消"获取解决方案。'
        );
        
        if (choice) {
          // 尝试直接下载
          generatePDF(invoiceData, translations);
        } else {
          // 提供解决方案
          alert(
            '解决方案：\n\n' +
            '1. 直接访问应用地址：' + window.location.href + '\n\n' +
            '2. 或者在新窗口中打开应用\n\n' +
            '3. 检查浏览器是否允许下载'
          );
        }
      } else {
        // 不在iframe中，正常生成
        generatePDF(invoiceData, translations);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '生成PDF时发生错误，请重试。';
      
      if (error.message.includes('download')) {
        errorMessage = 'PDF下载被阻止。请检查浏览器设置，或尝试在新窗口中打开应用。';
      } else if (error.message.includes('blob')) {
        errorMessage = 'PDF生成失败。请检查浏览器是否支持文件下载功能。';
      }
      
      alert(errorMessage);
    }
  };

  /**
   * 切换预览显示
   */
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // 根据屏幕尺寸确定布局
  const getLayoutClass = () => {
    if (isLargeScreen || isMediumScreen) {
      return 'layout-desktop';
    } else if (isSmallScreen) {
      return 'layout-tablet';
    } else {
      return 'layout-mobile';
    }
  };

  return (
    <div className={`app-container ${getLayoutClass()}`}>
      {/* 头部 */}
      <header className="app-header">
        <h1>{translations.title}</h1>
        <div className="header-actions">
          {isMobile && (
            <button 
              className="preview-toggle-btn"
              onClick={togglePreview}
            >
              {showPreview ? translations.hidePreview : translations.showPreview}
            </button>
          )}
          <button className="reset-btn" onClick={handleReset}>
            {translations.resetForm}
          </button>
          <button className="generate-btn" onClick={handleGeneratePDF}>
            {translations.generatePDF}
          </button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="app-main">
        {/* 表单区域 */}
        <section className="form-section">
          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            language={language}
            translations={translations}
            isMobile={isMobile}
          />
        </section>

        {/* 预览区域 */}
        {(!isMobile || showPreview) && (
          <section className="preview-section">
            <InvoicePreview
              invoiceData={invoiceData}
              language={language}
              translations={translations}
              isMobile={isMobile}
              showPreview={showPreview}
            />
          </section>
        )}
      </main>

      {/* 移动端预览提示 */}
      {isMobile && !showPreview && (
        <div className="mobile-preview-hint">
          <p>{translations.previewHidden}</p>
          <button onClick={togglePreview}>
            {translations.showPreview}
          </button>
        </div>
      )}
    </div>
  );
};

export default App; 