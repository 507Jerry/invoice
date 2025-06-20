import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceItem } from '../types';
import { calculateItemAmounts, formatCurrency } from '../utils/calculations';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceItemsFormProps {
  items: InvoiceItem[];
  includeGST: boolean;
  onChange: (items: InvoiceItem[]) => void;
}

/**
 * 发票项目表单组件
 */
const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({ items, includeGST, onChange }) => {
  const { t } = useTranslation();
  const [inputValues, setInputValues] = useState<Record<string, { description: string; quantity: string; unitPrice: string }>>({});

  useEffect(() => {
    const newValues: Record<string, { description: string; quantity: string; unitPrice: string }> = {};
    items.forEach(item => {
      newValues[item.id] = {
        description: item.description,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
      };
    });
    setInputValues(newValues);
  }, [items]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      gst: 0,
      total: 0
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleInputChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', value: string) => {
    setInputValues(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { description: '', quantity: '0', unitPrice: '0' }),
        [field]: value
      }
    }));
  };
  
  const handleInputBlur = (id: string, field: 'description' | 'quantity' | 'unitPrice') => {
    const currentItem = items.find(item => item.id === id);
    const localValue = inputValues[id]?.[field];

    if (!currentItem || localValue === undefined) return;

    if (field === 'quantity' || field === 'unitPrice') {
        const numericValue = parseFloat(localValue) || 0;
        if (currentItem[field] !== numericValue) {
            updateItem(id, field, numericValue);
        }
    } else {
        if (currentItem[field] !== localValue) {
            updateItem(id, field, localValue);
        }
    }
  };

  const updateItem = (id: string, field: keyof Omit<InvoiceItem, 'id' | 'subtotal' | 'gst' | 'total'>, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          return calculateItemAmounts(updatedItem, includeGST);
        }
        return updatedItem;
      }
      return item;
    });
    onChange(updatedItems);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{t('invoiceItems')}</h3>
        <button
          onClick={addItem}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('addItem')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('description')}</th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity')}</th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('unitPrice')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subtotal')}</th>
              {includeGST && (<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('gst')}</th>)}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('total')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const localDescription = inputValues[item.id]?.description ?? '';
              const localQuantity = inputValues[item.id]?.quantity ?? '0';
              const localUnitPrice = inputValues[item.id]?.unitPrice ?? '0';
              
              return (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={localDescription}
                    onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                    onBlur={() => handleInputBlur(item.id, 'description')}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('itemDescriptionPlaceholder')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    value={localQuantity}
                    onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                    onBlur={() => handleInputBlur(item.id, 'quantity')}
                    className="w-15 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={localUnitPrice}
                    onChange={(e) => handleInputChange(item.id, 'unitPrice', e.target.value)}
                    onBlur={() => handleInputBlur(item.id, 'unitPrice')}
                    className="w-15 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.subtotal)}
                </td>
                {includeGST && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.gst)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceItemsForm; 