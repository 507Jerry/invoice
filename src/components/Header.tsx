import { FileText, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * 页面头部组件
 */
const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary-600" />
            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              {t('appTitle')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Languages className="h-4 w-4 mr-2" />
              {i18n.language === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 