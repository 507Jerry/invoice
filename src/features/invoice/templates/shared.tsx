import type { BankDetails, Invoice, InvoiceItem, InvoiceTotals } from '../../../types/invoice'
import { formatMoney } from '../../../utils/money'

/**
 * 渲染地址行（按行换行）。
 */
export function AddressLines(props: { lines: string[] }) {
  if (!props.lines.length) return null
  return (
    <div className="invText">
      {props.lines.map((l, idx) => (
        <div key={idx}>{l}</div>
      ))}
    </div>
  )
}

/**
 * 统一渲染“Bill To / Ship To / Seller”块。
 */
export function PartyBlock(props: {
  title: string
  name?: string
  companyName?: string
  addressLines?: string[]
  phone?: string
  email?: string
}) {
  const hasAny =
    Boolean(props.name) ||
    Boolean(props.companyName) ||
    Boolean(props.addressLines?.length) ||
    Boolean(props.phone) ||
    Boolean(props.email)

  if (!hasAny) return null

  return (
    <div className="party">
      <div className="party__title">{props.title}</div>
      {props.name ? <div className="party__strong">{props.name}</div> : null}
      {props.companyName ? (
        <div className="party__strong">{props.companyName}</div>
      ) : null}
      {props.addressLines?.length ? <AddressLines lines={props.addressLines} /> : null}
      {props.phone ? <div className="invText">{props.phone}</div> : null}
      {props.email ? <div className="invText">{props.email}</div> : null}
    </div>
  )
}

/**
 * 明细表格（通用结构，样式由模板提供）。
 */
export function ItemsTable(props: {
  invoice: Invoice
  items: InvoiceItem[]
  columns?: { showSl?: boolean }
}) {
  const cur = props.invoice.meta.currency
  const showSl = props.columns?.showSl ?? false

  return (
    <table className="itemsTable">
      <thead>
        <tr>
          {showSl ? <th className="itemsTable__sl">Sl.</th> : null}
          <th>Description</th>
          <th className="itemsTable__num">Qty</th>
          <th className="itemsTable__num">Unit Price</th>
          <th className="itemsTable__num">Total</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((it, idx) => {
          const lineTotal = (Number.isFinite(it.qty) ? it.qty : 0) * (Number.isFinite(it.unitPrice) ? it.unitPrice : 0)
          return (
            <tr key={it.id}>
              {showSl ? <td className="itemsTable__sl">{idx + 1}</td> : null}
              <td className="itemsTable__desc">{it.description || '—'}</td>
              <td className="itemsTable__num">{it.qty}</td>
              <td className="itemsTable__num">{formatMoney(it.unitPrice, cur)}</td>
              <td className="itemsTable__num">{formatMoney(lineTotal, cur)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/**
 * 合计块（通用字段，样式由模板控制）。
 */
export function TotalsBlock(props: { invoice: Invoice; totals: InvoiceTotals; showPaid?: boolean }) {
  const cur = props.invoice.meta.currency
  const showPaid = props.showPaid ?? true

  return (
    <div className="totals">
      <div className="totals__row">
        <span>Subtotal</span>
        <span>{formatMoney(props.totals.subtotal, cur)}</span>
      </div>
      <div className="totals__row">
        <span>Discount</span>
        <span>-{formatMoney(props.totals.discount, cur)}</span>
      </div>
      <div className="totals__row">
        <span>Tax rate</span>
        <span>{props.invoice.adjustments.gstEnabled ? `${props.invoice.adjustments.gstRatePercent.toFixed(2)}%` : '0.00%'}</span>
      </div>
      <div className="totals__row">
        <span>Tax total</span>
        <span>{formatMoney(props.totals.gstAmount, cur)}</span>
      </div>
      <div className="totals__row totals__row--strong">
        <span>Total</span>
        <span>{formatMoney(props.totals.total, cur)}</span>
      </div>
      {showPaid ? (
        <>
          <div className="totals__row">
            <span>Paid</span>
            <span>{formatMoney(props.totals.amountPaid, cur)}</span>
          </div>
          <div className="totals__row totals__row--strong">
            <span>Balance Due</span>
            <span>{formatMoney(props.totals.balanceDue, cur)}</span>
          </div>
        </>
      ) : (
        <div className="totals__row totals__row--strong">
          <span>Balance Due</span>
          <span>{formatMoney(props.totals.balanceDue, cur)}</span>
        </div>
      )}
    </div>
  )
}

/**
 * 银行信息块：仅渲染用户填写的字段。
 */
export function BankDetailsBlock(props: { bank: BankDetails }) {
  const b = props.bank
  const hasStructured =
    Boolean(b.bankName?.trim()) ||
    Boolean(b.accountName?.trim()) ||
    Boolean(b.accountNumber?.trim()) ||
    Boolean(b.bsbSortCode?.trim()) ||
    Boolean(b.swiftBic?.trim()) ||
    Boolean(b.iban?.trim())
  const hasAdditional = Boolean(b.additionalDetails?.trim())
  if (!hasStructured && !hasAdditional) return null

  return (
    <div className="bankDetails">
      <div className="bankDetails__title">Bank Details</div>
      {hasStructured && (
        <div className="bankDetails__grid">
          {b.bankName?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">Bank Name</span>
              <span>{b.bankName}</span>
            </div>
          ) : null}
          {b.accountName?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">Account Name</span>
              <span>{b.accountName}</span>
            </div>
          ) : null}
          {b.accountNumber?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">Account Number</span>
              <span>{b.accountNumber}</span>
            </div>
          ) : null}
          {b.bsbSortCode?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">BSB / Sort Code</span>
              <span>{b.bsbSortCode}</span>
            </div>
          ) : null}
          {b.swiftBic?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">SWIFT / BIC</span>
              <span>{b.swiftBic}</span>
            </div>
          ) : null}
          {b.iban?.trim() ? (
            <div className="bankDetails__row">
              <span className="bankDetails__label">IBAN</span>
              <span>{b.iban}</span>
            </div>
          ) : null}
        </div>
      )}
      {hasAdditional && (
        <div className="bankDetails__extra invText">{b.additionalDetails}</div>
      )}
    </div>
  )
}

/**
 * Logo：有图则渲染图，无图则渲染占位。
 */
export function LogoMark(props: { dataUrl: string | null; variant?: 'circle' | 'square' }) {
  const variant = props.variant ?? 'circle'
  const className = variant === 'circle' ? 'logoMark logoMark--circle' : 'logoMark'

  return props.dataUrl ? (
    <img className={className} src={props.dataUrl} alt="Logo" />
  ) : (
    <div className={`${className} logoMark--placeholder`}>LOGO</div>
  )
}

