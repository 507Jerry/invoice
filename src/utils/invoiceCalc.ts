import type { Invoice, InvoiceTotals } from '../types/invoice'

/**
 * 计算发票的汇总数字（小计、折扣、GST、总计、应付等）。
 *
 * @param invoice - 发票数据
 */
export function calcInvoiceTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = invoice.items.reduce((sum, item) => {
    const qty = Number.isFinite(item.qty) ? item.qty : 0
    const unit = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
    return sum + qty * unit
  }, 0)

  const discount = clampToNonNegative(invoice.adjustments.discount)
  const taxableAmount = Math.max(0, subtotal - discount)

  const gstRate = invoice.adjustments.gstEnabled
    ? clampToNonNegative(invoice.adjustments.gstRatePercent)
    : 0
  const gstAmount = taxableAmount * (gstRate / 100)

  const total = taxableAmount + gstAmount
  const amountPaid = clampToNonNegative(invoice.adjustments.amountPaid)
  const balanceDue = Math.max(0, total - amountPaid)

  return {
    subtotal,
    discount,
    taxableAmount,
    gstAmount,
    total,
    amountPaid,
    balanceDue,
  }
}

/**
 * 约束到非负数。
 */
function clampToNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

