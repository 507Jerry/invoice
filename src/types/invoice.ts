/**
 * 支持的发票模板 ID。
 */
export type InvoiceTemplateId = 'orange' | 'blueFrame' | 'blueLine'

/**
 * 支持的货币代码（可按需扩展）。
 */
export type CurrencyCode = 'EUR' | 'AUD' | 'USD' | 'GBP' | 'NZD' | 'CAD' | 'SGD'

/**
 * 联系人/地址信息。
 */
export interface Party {
  name: string
  companyName: string
  addressLines: string[]
  phone: string
  email: string
}

/**
 * 发票元信息。
 */
export interface InvoiceMeta {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  paymentTerms: string
  currency: CurrencyCode
}

/**
 * 发票条目（明细行）。
 */
export interface InvoiceItem {
  id: string
  description: string
  qty: number
  unitPrice: number
}

/**
 * 发票可选 Logo。
 */
export interface InvoiceLogo {
  dataUrl: string | null
  alt: string
}

/**
 * 折扣/税/已付等调整项。
 */
export interface InvoiceAdjustments {
  discount: number
  gstEnabled: boolean
  gstRatePercent: number
  amountPaid: number
}

/**
 * 银行信息（用户自行填写，全部可选）。
 */
export interface BankDetails {
  bankName: string
  accountName: string
  accountNumber: string
  /** BSB / Sort Code / Routing Number 等 */
  bsbSortCode: string
  swiftBic: string
  iban: string
  /** 其他说明，自由文本 */
  additionalDetails: string
}

/**
 * 发票主数据结构。
 */
export interface Invoice {
  meta: InvoiceMeta
  seller: Party
  billTo: Party
  shipTo: Party
  logo: InvoiceLogo
  items: InvoiceItem[]
  adjustments: InvoiceAdjustments
  /** 银行信息（用户自行添加） */
  bank: BankDetails
  notes: string
  terms: string
  paymentInstructions: string
  signatoryName: string
}

/**
 * 计算后的总计数据。
 */
export interface InvoiceTotals {
  subtotal: number
  discount: number
  taxableAmount: number
  gstAmount: number
  total: number
  amountPaid: number
  balanceDue: number
}

