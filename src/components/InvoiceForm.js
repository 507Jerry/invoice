import React from 'react';
import { formatCurrency, calculateLineSubtotal } from '../utils/invoiceUtils';
import './InvoiceForm.css';

/**
 * 发票表单组件
 * @param {object} props - 组件属性
 * @param {object} props.invoiceData - 发票数据
 * @param {function} props.setInvoiceData - 设置发票数据的函数
 * @param {string} props.language - 当前语言
 * @param {object} props.translations - 翻译对象
 * @param {boolean} props.isMobile - 是否为移动设备
 */
const InvoiceForm = ({ invoiceData, setInvoiceData, language, translations, isMobile }) => {
  
  /**
   * 更新公司信息
   * @param {string} field - 字段名
   * @param {string} value - 字段值
   */
  const updateCompany = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value
      }
    }));
  };

  /**
   * 更新客户信息
   * @param {string} field - 字段名
   * @param {string} value - 字段值
   */
  const updateClient = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
  };

  /**
   * 更新发票信息
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const updateInvoice = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        [field]: value
      }
    }));
  };

  /**
   * 更新明细项
   * @param {number} index - 明细索引
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const updateItem = (index, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  /**
   * 更新设置
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const updateSettings = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  /**
   * 添加明细行
   */
  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { name: '', quantity: 1, unitPrice: 0 }
      ]
    }));
  };

  /**
   * 删除明细行
   * @param {number} index - 明细索引
   */
  const removeItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items
    }));
  };

  /**
   * 更新支付信息
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const updatePayment = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }));
  };

  /**
   * 更新备注
   * @param {string} value - 备注内容
   */
  const updateNote = (value) => {
    if (value.length <= 500) {
      setInvoiceData(prev => ({
        ...prev,
        note: value
      }));
    }
  };

  return (
    <div className="invoice-form">
      {/* 语言切换 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.language}</h3>
        </div>
        <div className="language-toggle">
          <button
            className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
            onClick={() => setInvoiceData(prev => ({ ...prev, language: 'zh' }))}
          >
            {translations.chinese}
          </button>
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setInvoiceData(prev => ({ ...prev, language: 'en' }))}
          >
            {translations.english}
          </button>
        </div>
      </div>

      {/* 公司信息 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.companyInfo}</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>{translations.companyName} *</label>
            <input
              type="text"
              value={invoiceData.company.name}
              onChange={(e) => updateCompany('name', e.target.value)}
              placeholder={translations.companyName}
            />
          </div>
          <div className="form-group">
            <label>{translations.abn} *</label>
            <input
              type="text"
              value={invoiceData.company.abn}
              onChange={(e) => updateCompany('abn', e.target.value)}
              placeholder="12 345 678 901"
            />
          </div>
          <div className="form-group full-width">
            <label>{translations.address} *</label>
            <textarea
              value={invoiceData.company.address}
              onChange={(e) => updateCompany('address', e.target.value)}
              placeholder={translations.address}
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>{translations.phone} *</label>
            <input
              type="tel"
              value={invoiceData.company.phone}
              onChange={(e) => updateCompany('phone', e.target.value)}
              placeholder="+61 2 1234 5678"
            />
          </div>
          <div className="form-group">
            <label>{translations.email} *</label>
            <input
              type="email"
              value={invoiceData.company.email}
              onChange={(e) => updateCompany('email', e.target.value)}
              placeholder="info@example.com"
            />
          </div>
          <div className="form-group full-width">
            <label>{translations.slogan}</label>
            <input
              type="text"
              value={invoiceData.company.slogan}
              onChange={(e) => updateCompany('slogan', e.target.value)}
              placeholder={translations.slogan}
            />
          </div>
        </div>
      </div>

      {/* 客户信息 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.clientInfo}</h3>
        </div>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>{translations.clientName} *</label>
            <input
              type="text"
              value={invoiceData.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder={translations.clientName}
            />
          </div>
          <div className="form-group full-width">
            <label>{translations.clientAddress} *</label>
            <textarea
              value={invoiceData.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder={translations.clientAddress}
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>{translations.clientPhone}</label>
            <input
              type="tel"
              value={invoiceData.client.phone}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="+61 3 9876 5432"
            />
          </div>
        </div>
      </div>

      {/* 发票信息 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.invoiceInfo}</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>{translations.invoiceNumber}</label>
            <input
              type="text"
              value={invoiceData.invoice.number}
              onChange={(e) => updateInvoice('number', e.target.value)}
              placeholder="INV-20240601-001"
            />
            <small>{translations.autoGenerated}</small>
          </div>
          <div className="form-group">
            <label>{translations.date} *</label>
            <input
              type="date"
              value={invoiceData.invoice.date.toISOString().split('T')[0]}
              onChange={(e) => updateInvoice('date', new Date(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>{translations.dueDate} *</label>
            <input
              type="date"
              value={invoiceData.invoice.dueDate.toISOString().split('T')[0]}
              onChange={(e) => updateInvoice('dueDate', new Date(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>{translations.projectDescription}</label>
            <input
              type="text"
              value={invoiceData.invoice.projectDescription}
              onChange={(e) => updateInvoice('projectDescription', e.target.value)}
              placeholder={translations.projectDescription}
            />
          </div>
          <div className="form-group">
            <label>{translations.poNumber}</label>
            <input
              type="text"
              value={invoiceData.invoice.poNumber}
              onChange={(e) => updateInvoice('poNumber', e.target.value)}
              placeholder="PO-2024-001"
            />
          </div>
        </div>
      </div>

      {/* GST设置 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.gstSettings}</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={invoiceData.settings.includeGST}
                onChange={(e) => updateSettings('includeGST', e.target.checked)}
              />
              {translations.includeGST}
            </label>
          </div>
          {invoiceData.settings.includeGST && (
            <div className="form-group">
              <label>{translations.gstRate}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={invoiceData.settings.gstRate}
                onChange={(e) => updateSettings('gstRate', parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      {/* 明细列表 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.items}</h3>
        </div>
        <div className="items-table-container">
          <table className="items-form-table">
            <thead>
              <tr>
                <th>{translations.itemName}</th>
                <th>{translations.quantity}</th>
                <th>{translations.unitPrice}</th>
                <th>{translations.subtotal}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder={translations.itemName}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="subtotal-cell">
                    {formatCurrency(calculateLineSubtotal(item.quantity, item.unitPrice))}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(index)}
                      disabled={invoiceData.items.length === 1}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-item-btn" onClick={addItem}>
            + {translations.items}
          </button>
        </div>
      </div>

      {/* 支付信息设置 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.paymentInfo}</h3>
        </div>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>
              <input
                type="checkbox"
                checked={invoiceData.payment?.showBank}
                onChange={e => updatePayment('showBank', e.target.checked)}
              />
              {translations.bankAccount}
            </label>
          </div>
          {invoiceData.payment?.showBank && (
            <>
              <div className="form-group full-width">
                <label>{translations.bankAccount}</label>
                <input
                  type="text"
                  value={invoiceData.payment.bankAccount}
                  onChange={e => updatePayment('bankAccount', e.target.value)}
                  placeholder={translations.bankAccount}
                />
              </div>
              <div className="form-group">
                <label>{translations.bsb}</label>
                <input
                  type="text"
                  value={invoiceData.payment.bsb}
                  onChange={e => updatePayment('bsb', e.target.value)}
                  placeholder={translations.bsb}
                />
              </div>
              <div className="form-group">
                <label>{translations.accountNumber}</label>
                <input
                  type="text"
                  value={invoiceData.payment.accountNumber}
                  onChange={e => updatePayment('accountNumber', e.target.value)}
                  placeholder={translations.accountNumber}
                />
              </div>
            </>
          )}
          <div className="form-group full-width">
            <label>
              <input
                type="checkbox"
                checked={invoiceData.payment?.showBpay}
                onChange={e => updatePayment('showBpay', e.target.checked)}
              />
              BPAY
            </label>
          </div>
          {invoiceData.payment?.showBpay && (
            <div className="form-group full-width">
              <label>BPAY Number</label>
              <input
                type="text"
                value={invoiceData.payment.bpayNumber}
                onChange={e => updatePayment('bpayNumber', e.target.value)}
                placeholder="BPAY Number"
              />
            </div>
          )}
        </div>
      </div>

      {/* 备注（Note）设置 */}
      <div className="form-section">
        <div className="section-header">
          <h3>{translations.note}</h3>
        </div>
        <div className="form-group full-width">
          <textarea
            value={invoiceData.note || ''}
            onChange={e => updateNote(e.target.value)}
            placeholder={translations.notePlaceholder}
            rows={4}
            maxLength={500}
            style={{ resize: 'vertical' }}
          />
          <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
            {translations.noteCount} {invoiceData.note?.length || 0}/500
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm; 