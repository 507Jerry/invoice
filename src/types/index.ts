/**
 * 发票项目类型
 */
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gst: number;
  total: number;
}

/**
 * 公司信息类型
 */
export interface CompanyInfo {
  name: string;
  address: string;
  abn: string;
  phone: string;
  email: string;
}

/**
 * 客户信息类型
 */
export interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

/**
 * 发票数据类型
 */
export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  gstTotal: number;
  total: number;
  notes: string;
  terms: string;
  includeGST: boolean;
} 