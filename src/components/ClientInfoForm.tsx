import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClientInfo } from '../types';

interface ClientInfoFormProps {
  client: ClientInfo;
  onChange: (client: ClientInfo) => void;
}

/**
 * 客户信息表单组件
 */
const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ client, onChange }) => {
  const { t } = useTranslation();
  const handleChange = (field: keyof ClientInfo, value: string) => {
    onChange({
      ...client,
      [field]: value
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('clientInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('clientName')}
          </label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('clientNamePlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('phone')}
          </label>
          <input
            type="tel"
            value={client.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('phonePlaceholder')}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('clientAddress')}
          </label>
          <textarea
            value={client.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('clientAddressPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('email')}
          </label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('emailPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm; 