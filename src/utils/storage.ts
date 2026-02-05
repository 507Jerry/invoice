import type { Invoice } from '../types/invoice'

const STORAGE_KEY = 'invoice2026.invoice.draft.v1'
const PRESET_KEY = 'invoice2026.presets.v1'

/**
 * 发票预设：只保存「公司 + 银行 + 付款说明等」这些相对固定的信息。
 */
export interface InvoicePreset {
  id: string
  name: string
  seller: Invoice['seller']
  bank: Invoice['bank']
  paymentInstructions: string
  terms: string
  notes: string
  signatoryName: string
}

/**
 * 从浏览器 localStorage 读取发票草稿。
 *
 * @returns 若成功解析则返回 Invoice 对象，否则返回 null。
 */
export function loadInvoiceDraft(): Invoice | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Invoice
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

/**
 * 将当前发票草稿保存到 localStorage。
 *
 * @param invoice - 要保存的发票数据
 */
export function saveInvoiceDraft(invoice: Invoice): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice))
  } catch {
    // 忽略存储错误（例如容量满或禁用）
  }
}

/**
 * 清除本地保存的发票草稿。
 */
export function clearInvoiceDraft(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/**
 * 读取所有本地预设。
 */
export function loadInvoicePresets(): InvoicePreset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(PRESET_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as InvoicePreset[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/**
 * 覆盖保存全部预设列表。
 *
 * @param presets - 要保存的预设数组
 */
export function saveInvoicePresets(presets: InvoicePreset[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PRESET_KEY, JSON.stringify(presets))
  } catch {
    // ignore
  }
}

