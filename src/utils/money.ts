import type { CurrencyCode } from '../types/invoice'

/**
 * 把数字格式化为货币（英文界面统一用 en）。
 *
 * @param amount - 金额（可为 0 或负数）
 * @param currency - ISO 货币代码
 * @returns 格式化后的字符串（包含货币符号）
 */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)
}

/**
 * 安全解析输入框的数值（空/非法时返回 0）。
 *
 * @param value - input 字符串
 */
export function parseNumber(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

