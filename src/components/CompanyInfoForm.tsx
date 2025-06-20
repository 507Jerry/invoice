import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyInfo } from '../types';

interface CompanyInfoFormProps {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}

/**
 * 公司信息表单组件
 */
const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ company, onChange }) => {
  const { t } = useTranslation();
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({
      ...company,
      [field]: value
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('companyInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('companyName')}
          </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('companyNamePlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('abn')}
          </label>
          <input
            type="text"
            value={company.abn}
            onChange={(e) => handleChange('abn', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('abnPlaceholder')}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('companyAddress')}
          </label>
          <textarea
            value={company.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('companyAddressPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('phone')}
          </label>
          <input
            type="tel"
            value={company.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('phonePlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('email')}
          </label>
          <input
            type="email"
            value={company.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('emailPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoForm; 