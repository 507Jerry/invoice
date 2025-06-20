import React from 'react';
import { useTranslation } from 'react-i18next';

interface InvoiceInfoFormProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  onInvoiceNumberChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
}

/**
 * 发票基础信息表单组件 (编号, 日期)
 */
const InvoiceInfoForm: React.FC<InvoiceInfoFormProps> = ({
  invoiceNumber,
  issueDate,
  dueDate,
  onInvoiceNumberChange,
  onIssueDateChange,
  onDueDateChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('invoiceInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {t('invoiceNumber')}
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('issueDate')}
          </label>
          <input
            type="date"
            id="issueDate"
            value={issueDate}
            onChange={(e) => onIssueDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('dueDate')}
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfoForm; 