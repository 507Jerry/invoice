import React, { useRef, useEffect, useState } from 'react';
import { formatCurrency, formatDate, calculateLineSubtotal, calculateInvoiceTotal } from '../utils/invoiceUtils';
import './InvoicePreview.css';

/**
 * 发票预览组件
 * @param {object} props - 组件属性
 * @param {object} props.invoiceData - 发票数据
 * @param {string} props.language - 当前语言
 * @param {object} props.translations - 翻译对象
 * @param {boolean} props.isMobile - 是否为移动设备
 * @param {boolean} props.showPreview - 是否显示预览
 */
const InvoicePreview = ({ invoiceData, language, translations, isMobile, showPreview }) => {
  const previewRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(0);

  // 计算预览缩放比例
  useEffect(() => {
    if (!previewRef.current) return;

    const container = previewRef.current.parentElement;
    const preview = previewRef.current;
    
    if (!container || !preview) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const previewWidth = preview.scrollWidth;
    const previewHeight = preview.scrollHeight;

    // 计算缩放比例
    const scaleX = containerWidth / previewWidth;
    const scaleY = containerHeight / previewHeight;
    const newScale = Math.min(scaleX, scaleY, 1); // 不超过1倍

    // 设置最小缩放比例
    const minScale = isMobile ? 0.3 : 0.5;
    const finalScale = Math.max(newScale, minScale);

    setScale(finalScale);
    setContainerHeight(containerHeight);
  }, [invoiceData, isMobile, showPreview]);

  // 如果隐藏预览，返回null
  if (!showPreview) {
    return null;
  }

  const { company, client, invoice, items, settings, payment } = invoiceData;
  const { includeGST, gstRate } = settings;
  const totals = calculateInvoiceTotal(items, includeGST, gstRate);

  return (
    <div className="invoice-preview-container">
      <div 
        className="invoice-preview-wrapper"
        style={{ 
          height: containerHeight || '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        <div ref={previewRef} className="invoice-preview">
          {/* 发票头部 */}
          <div className="invoice-header">
            <div className="company-info">
              <h1 className="company-name">{company.name}</h1>
              {company.slogan && <p className="company-slogan">{company.slogan}</p>}
              <p className="company-abn">ABN: {company.abn}</p>
              <p className="company-address">{company.address}</p>
              <p className="company-contact">
                {company.phone} | {company.email}
              </p>
            </div>
            <div className="invoice-title">
              <h2>{translations.invoice}</h2>
            </div>
          </div>

          {/* 发票信息 */}
          <div className="invoice-info">
            <div className="client-info">
              <h3>{translations.invoiceTo}</h3>
              <p className="client-name">{client.name}</p>
              <p className="client-address">{client.address}</p>
              <p className="client-phone">{client.phone}</p>
            </div>
            <div className="invoice-details">
              <div className="invoice-row">
                <span className="label">{translations.invoiceNumber}:</span>
                <span className="value">{invoice.number}</span>
              </div>
              <div className="invoice-row">
                <span className="label">{translations.invoiceDate}:</span>
                <span className="value">{formatDate(invoice.date)}</span>
              </div>
              <div className="invoice-row">
                <span className="label">{translations.dueDate}:</span>
                <span className="value">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.projectDescription && (
                <div className="invoice-row">
                  <span className="label">{translations.projectDescription}:</span>
                  <span className="value">{invoice.projectDescription}</span>
                </div>
              )}
              {invoice.poNumber && (
                <div className="invoice-row">
                  <span className="label">{translations.poNumber}:</span>
                  <span className="value">{invoice.poNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* 明细表格 */}
          <div className="invoice-items">
            <table className="items-table">
              <thead>
                <tr>
                  <th className="item-name">{translations.itemName}</th>
                  <th className="item-quantity">{translations.quantity}</th>
                  <th className="item-price">{translations.unitPrice}</th>
                  <th className="item-subtotal">{translations.subtotal}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-quantity">{item.quantity}</td>
                    <td className="item-price">{formatCurrency(item.unitPrice)}</td>
                    <td className="item-subtotal">
                      {formatCurrency(calculateLineSubtotal(item.quantity, item.unitPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 总计 */}
          <div className="invoice-totals">
            {includeGST && (
              <>
                <div className="total-row">
                  <span className="label">{translations.subtotal}:</span>
                  <span className="value">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="total-row">
                  <span className="label">{translations.gst} ({(gstRate * 100).toFixed(0)}%):</span>
                  <span className="value">{formatCurrency(totals.gst)}</span>
                </div>
              </>
            )}
            <div className="total-row total-final">
              <span className="label">{translations.total}:</span>
              <span className="value">{formatCurrency(totals.total)}</span>
            </div>
          </div>

          {/* 页脚 */}
          <div className="invoice-footer">
            <div className="payment-info">
              <h4>{translations.paymentInfo}</h4>
              {payment?.showBank && (
                <>
                  <p>{translations.bankAccount}: {payment.bankAccount}</p>
                  <p>{translations.bsb}: {payment.bsb}</p>
                  <p>{translations.accountNumber}: {payment.accountNumber}</p>
                </>
              )}
              {payment?.showBpay && (
                <>
                  <p>BPAY Number: {payment.bpayNumber}</p>
                </>
              )}
            </div>
            <div className="thank-you">
              <p>{translations.thankYou}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview; 