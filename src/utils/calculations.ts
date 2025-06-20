import { InvoiceItem } from '../types';

/**
 * 计算发票项目的金额
 * @param item 发票项目
 * @param includeGST 是否包含GST
 * @returns 更新后的发票项目
 */
export const calculateItemAmounts = (item: InvoiceItem, includeGST: boolean): InvoiceItem => {
  const subtotal = item.quantity * item.unitPrice;
  const gst = includeGST ? subtotal * 0.1 : 0; // GST税率为10%
  const total = subtotal + gst;

  return {
    ...item,
    subtotal,
    gst,
    total
  };
};

/**
 * 计算发票总计
 * @param items 发票项目数组
 * @param includeGST 是否包含GST
 * @returns 包含小计、GST总计和总计的对象
 */
export const calculateInvoiceTotals = (items: InvoiceItem[], includeGST: boolean) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const gstTotal = includeGST ? subtotal * 0.1 : 0;
  const total = subtotal + gstTotal;

  return { subtotal, gstTotal, total };
};

/**
 * 格式化货币
 * @param amount 金额
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

/**
 * 生成发票编号
 * @returns 发票编号
 */
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
}; 