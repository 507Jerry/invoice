import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import CompanyInfoForm from './components/CompanyInfoForm';
import ClientInfoForm from './components/ClientInfoForm';
import InvoiceItemsForm from './components/InvoiceItemsForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceInfoForm from './components/InvoiceInfoForm';
import DonationCard from './components/DonationCard';
import { InvoiceData, InvoiceItem } from './types';
import { calculateInvoiceTotals, generateInvoiceNumber } from './utils/calculations';
import { generatePDF } from './utils/pdfGenerator';

/**
 * 主应用组件
 */
const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [invoice, setInvoice] = useState<InvoiceData>({
    id: Date.now().toString(),
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    company: {
      name: '',
      address: '',
      abn: '',
      phone: '',
      email: ''
    },
    client: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    items: [{
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      gst: 0,
      total: 0
    }],
    subtotal: 0,
    gstTotal: 0,
    total: 0,
    notes: '',
    terms: t('paymentTermsDefault'),
    includeGST: true
  });

  const previewRef = useRef<HTMLDivElement>(null);

  // 当语言切换时，更新默认的付款条款
  useEffect(() => {
    const defaultZh = t('paymentTermsDefault', { lng: 'zh' });
    const defaultEn = t('paymentTermsDefault', { lng: 'en' });

    // 仅当条款为默认值时才更新，避免覆盖用户输入
    if (invoice.terms === defaultZh || invoice.terms === defaultEn) {
      setInvoice(prev => ({
        ...prev,
        terms: t('paymentTermsDefault')
      }));
    }
  }, [i18n.language, t, invoice.terms]);

  // 当发票项目或GST设置改变时，重新计算总计
  useEffect(() => {
    const { subtotal, gstTotal, total } = calculateInvoiceTotals(invoice.items, invoice.includeGST);
    setInvoice(prev => ({
      ...prev,
      subtotal,
      gstTotal,
      total
    }));
  }, [invoice.items, invoice.includeGST]);

  const handleCompanyChange = (company: InvoiceData['company']) => {
    setInvoice(prev => ({ ...prev, company }));
  };

  const handleClientChange = (client: InvoiceData['client']) => {
    setInvoice(prev => ({ ...prev, client }));
  };

  const handleItemsChange = (items: InvoiceItem[]) => {
    setInvoice(prev => ({ ...prev, items }));
  };

  const handleGSTChange = (includeGST: boolean) => {
    setInvoice(prev => ({ ...prev, includeGST }));
  };

  const handleInvoiceInfoChange = (field: 'invoiceNumber' | 'issueDate' | 'dueDate', value: string) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleExportPDF = async () => {
    if (previewRef.current) {
      try {
        await generatePDF(invoice, previewRef.current);
      } catch (error) {
        console.error('导出PDF失败:', error);
        alert('导出PDF失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧表单 */}
          <div className="space-y-6">
            {/* GST选项 */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeGST"
                  checked={invoice.includeGST}
                  onChange={(e) => handleGSTChange(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeGST" className="ml-2 block text-sm text-gray-900">
                  {t('gstIncluded')}
                </label>
              </div>
            </div>

            {/* 发票基础信息 */}
            <InvoiceInfoForm
              invoiceNumber={invoice.invoiceNumber}
              issueDate={invoice.issueDate}
              dueDate={invoice.dueDate}
              onInvoiceNumberChange={(value) => handleInvoiceInfoChange('invoiceNumber', value)}
              onIssueDateChange={(value) => handleInvoiceInfoChange('issueDate', value)}
              onDueDateChange={(value) => handleInvoiceInfoChange('dueDate', value)}
            />

            {/* 公司信息 */}
            <CompanyInfoForm 
              company={invoice.company} 
              onChange={handleCompanyChange} 
            />

            {/* 客户信息 */}
            <ClientInfoForm 
              client={invoice.client} 
              onChange={handleClientChange} 
            />

            {/* 发票项目 */}
            <InvoiceItemsForm 
              items={invoice.items} 
              includeGST={invoice.includeGST}
              onChange={handleItemsChange} 
            />

            {/* 备注和条款 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('notesAndTerms')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('notes')}
                  </label>
                  <textarea
                    value={invoice.notes}
                    onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('notesPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('terms')}
                  </label>
                  <textarea
                    value={invoice.terms}
                    onChange={(e) => setInvoice(prev => ({ ...prev, terms: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('termsPlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧预览 */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white shadow rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('invoicePreview')}</h3>
              <button
                onClick={handleExportPDF}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('exportPDF')}
              </button>
            </div>
            
            <div ref={previewRef} className="bg-white shadow-lg rounded-lg">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </div>
      </main>

      <DonationCard />
    </div>
  );
};

export default App; 