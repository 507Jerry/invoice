import React from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceData } from '../types';
import { formatCurrency } from '../utils/calculations';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

/**
 * 发票预览组件
 */
const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 font-sans text-sm text-gray-800 bg-white">
      {/* 发票头部 */}
      <div className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold uppercase text-gray-900">{t('invoice')}</h1>
          <div className="mt-2 text-gray-600">
            <p><strong>{t('invoiceNumber')}</strong> {invoice.invoiceNumber}</p>
            <p><strong>{t('issueDate')}</strong> {invoice.issueDate}</p>
            <p><strong>{t('dueDate')}</strong> {invoice.dueDate}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">{invoice.company.name}</h2>
          <p className="whitespace-pre-line">{invoice.company.address}</p>
        </div>
      </div>

      {/* 公司信息 */}
      <div className="grid grid-cols-2 gap-4 py-4">
        <div>
          <h3 className="font-semibold text-gray-600 uppercase mb-2">{t('from')}</h3>
          <p className="font-bold text-gray-900">{invoice.company.name}</p>
          {invoice.company.abn && <p><strong>{t('abnLabel')}</strong> {invoice.company.abn}</p>}
          <p className="whitespace-pre-line">{invoice.company.address}</p>
          {invoice.company.phone && <p><strong>{t('phoneLabel')}</strong> {invoice.company.phone}</p>}
          {invoice.company.email && <p><strong>{t('emailLabel')}</strong> {invoice.company.email}</p>}
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 uppercase mb-2">{t('to')}</h3>
          <p className="font-bold text-gray-900">{invoice.client.name}</p>
          <p className="whitespace-pre-line">{invoice.client.address}</p>
          {invoice.client.phone && <p><strong>{t('phoneLabel')}</strong> {invoice.client.phone}</p>}
          {invoice.client.email && <p><strong>{t('emailLabel')}</strong> {invoice.client.email}</p>}
        </div>
      </div>

      {/* 发票项目表格 */}
      <table className="min-w-full mb-4">
        <thead className="border-b border-gray-300">
          <tr className="text-left text-gray-600 uppercase text-xs">
            <th className="py-2 pr-4 font-semibold">{t('description')}</th>
            <th className="py-2 px-4 font-semibold text-right">{t('quantity')}</th>
            <th className="py-2 px-4 font-semibold text-right">{t('unitPrice')}</th>
            <th className="py-2 pl-4 font-semibold text-right">{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map(item => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{item.description}</td>
              <td className="py-2 px-4 text-right">{item.quantity}</td>
              <td className="py-2 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 pl-4 text-right">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 总计 */}
      <div className="flex justify-end mb-8">
        <div className="w-1/3">
          <div className="flex justify-between py-1">
            <span>{t('subtotal')}</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.includeGST && (
            <div className="flex justify-between py-1">
              <span>{t('gstAmount')}</span>
              <span>{formatCurrency(invoice.gstTotal)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
            <span>{t('totalAmount')}</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>
      
      {/* 备注和条款 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        {invoice.notes && (
          <div>
            <h4 className="font-semibold mb-1">{t('notes')}</h4>
            <p className="whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
        {invoice.terms && (
          <div>
            <h4 className="font-semibold mb-1">{t('terms')}</h4>
            <p className="whitespace-pre-line">{invoice.terms}</p>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="pt-8 mt-8 border-t border-gray-300 text-center text-xs text-gray-500">
        {invoice.includeGST && invoice.company.abn && (
          <p>{t('taxInvoiceNotice', { abn: invoice.company.abn })}</p>
        )}
      </footer>
    </div>
  );
};

export default InvoicePreview; 