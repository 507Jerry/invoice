import type { Invoice, InvoiceTotals } from '../../../types/invoice'
import { formatMoney } from '../../../utils/money'
import { BankDetailsBlock, ItemsTable, LogoMark } from './shared'

/**
 * 模板 4：蓝色顶部横条 + 中间汇总块（参考你提供的 MIA 样式）。
 */
export function TemplateBluePanel(props: { invoice: Invoice; totals: InvoiceTotals }) {
  const inv = props.invoice
  const cur = inv.meta.currency

  return (
    <div className="tpl tpl--bluePanel">
      <header className="bluePanel__header">
        <div className="bluePanel__brandBar">
          <div className="bluePanel__brandText">
            {inv.seller.companyName || 'Your Company Name'}
          </div>
          <div className="bluePanel__brandLogo">
            <LogoMark dataUrl={inv.logo.dataUrl} variant="square" />
          </div>
        </div>

        <div className="bluePanel__topRow">
          <div className="bluePanel__titleBlock">
            <div className="bluePanel__title">INVOICE</div>
          </div>
          <div className="bluePanel__infoBox">
            <div className="bluePanel__infoLine">
              {inv.seller.companyName}
            </div>
            {inv.seller.addressLines.map((line, idx) => (
              <div key={idx} className="bluePanel__infoLine">
                {line}
              </div>
            ))}
            {inv.seller.phone && (
              <div className="bluePanel__infoLine">{inv.seller.phone}</div>
            )}
            {inv.seller.email && (
              <div className="bluePanel__infoLine">{inv.seller.email}</div>
            )}
          </div>
        </div>
      </header>

      <section className="bluePanel__body">
        <div className="bluePanel__tableWrap">
          <ItemsTable invoice={inv} items={inv.items} />
        </div>

        <div className="bluePanel__summaryRow">
          <div className="bluePanel__issued">
            <div className="invText">
              Issued date: {inv.meta.invoiceDate || '—'} Payment
            </div>
            <div className="bluePanel__gstToggle">
              <span className="bluePanel__gstBox">
                {inv.adjustments.gstEnabled ? '☑' : '☐'}
              </span>
              <span className="bluePanel__gstLabel">GST included</span>
            </div>
          </div>

          <div className="bluePanel__totalBox">
            <div className="bluePanel__currencyLabel">
              {inv.meta.currency}
            </div>
            <div className="bluePanel__amountLine">
              <span className="bluePanel__amountLabel">Subtotal</span>
              <span>{formatMoney(props.totals.subtotal, cur)}</span>
            </div>
            <div className="bluePanel__amountLine">
              <span className="bluePanel__amountLabel">GST</span>
              <span>{formatMoney(props.totals.gstAmount, cur)}</span>
            </div>
            <div className="bluePanel__amountLine bluePanel__amountLine--strong">
              <span className="bluePanel__amountLabel">Total</span>
              <span>{formatMoney(props.totals.total, cur)}</span>
            </div>
          </div>
        </div>

        <div className="bluePanel__metaRow">
          <div className="invText">
            INVOICE NUMBER: {inv.meta.invoiceNumber || '—'}
          </div>
          <div className="invText">
            Issued to: {inv.billTo.companyName || inv.billTo.name || '—'}
          </div>
        </div>

        <div className="bluePanel__bankBox">
          <BankDetailsBlock bank={inv.bank} />
        </div>

        {inv.notes || inv.terms ? (
          <div className="bluePanel__footerNotes">
            <div className="invText">{inv.notes}</div>
            <div className="invText">{inv.terms}</div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

