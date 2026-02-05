import type { Invoice, InvoiceTotals } from '../../../types/invoice'
import { formatMoney } from '../../../utils/money'
import { BankDetailsBlock, ItemsTable, LogoMark, PartyBlock, TotalsBlock } from './shared'

/**
 * 模板 1：橙色头部（参考你上传的橙色风格）。
 */
export function TemplateOrange(props: { invoice: Invoice; totals: InvoiceTotals }) {
  const inv = props.invoice
  const cur = inv.meta.currency

  return (
    <div className="tpl tpl--orange">
      <div className="tplOrange__header">
        <div className="tplOrange__title">INVOICE</div>
        <div className="tplOrange__logo">
          <LogoMark dataUrl={inv.logo.dataUrl} variant="circle" />
        </div>
        <div className="tplOrange__seller">
          <div className="tplOrange__sellerName">{inv.seller.companyName}</div>
          <div className="invText">{inv.seller.addressLines.join(' · ')}</div>
          {inv.seller.phone ? <div className="invText">{inv.seller.phone}</div> : null}
          {inv.seller.email ? <div className="invText">{inv.seller.email}</div> : null}
        </div>
      </div>

      <div className="tplOrange__metaRow">
        <div className="invMeta">
          <div className="invMeta__label">INVOICE NO.</div>
          <div className="invMeta__value">{inv.meta.invoiceNumber}</div>
          <div className="invMeta__hint">{inv.meta.paymentTerms}</div>
        </div>
        <div className="invMeta invMeta--right">
          <div className="invMeta__label">DATE</div>
          <div className="invMeta__value">{inv.meta.invoiceDate}</div>
          <div className="invMeta__hint">Due: {inv.meta.dueDate}</div>
        </div>
      </div>

      <div className="tplOrange__parties">
        <PartyBlock
          title="BILL TO"
          name={inv.billTo.name}
          companyName={inv.billTo.companyName}
          addressLines={inv.billTo.addressLines}
          phone={inv.billTo.phone}
          email={inv.billTo.email}
        />
        <PartyBlock
          title="SHIP TO"
          name={inv.shipTo.name}
          companyName={inv.shipTo.companyName}
          addressLines={inv.shipTo.addressLines}
          phone={inv.shipTo.phone}
          email={inv.shipTo.email}
        />
      </div>

      <div className="tplOrange__tableWrap">
        <ItemsTable invoice={inv} items={inv.items} />
      </div>

      <div className="tplOrange__bottom">
        <div className="tplOrange__notes">
          <div className="smallTitle">Remarks / Payment Instructions:</div>
          <div className="invText">{inv.paymentInstructions || '—'}</div>
          <BankDetailsBlock bank={inv.bank} />
          <div className="invText" style={{ marginTop: 8 }}>
            {inv.notes || ''}
          </div>
        </div>
        <div className="tplOrange__totals">
          <TotalsBlock invoice={inv} totals={props.totals} />
          <div className="balanceBadge">
            <span>Balance Due</span>
            <strong>{formatMoney(props.totals.balanceDue, cur)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

