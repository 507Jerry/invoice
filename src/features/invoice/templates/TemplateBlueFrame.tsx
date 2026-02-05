import type { Invoice, InvoiceTotals } from '../../../types/invoice'
import { BankDetailsBlock, ItemsTable, LogoMark, PartyBlock, TotalsBlock } from './shared'

/**
 * 模板 2：蓝色上下边框（参考你上传的蓝色边框风格）。
 */
export function TemplateBlueFrame(props: { invoice: Invoice; totals: InvoiceTotals }) {
  const inv = props.invoice

  return (
    <div className="tpl tpl--blueFrame">
      <div className="blueFrame__bar blueFrame__bar--top" />

      <div className="blueFrame__header">
        <div className="blueFrame__title">INVOICE</div>
        <div className="blueFrame__logo">
          <LogoMark dataUrl={inv.logo.dataUrl} variant="circle" />
        </div>
      </div>

      <div className="blueFrame__infoRow">
        <div className="blueFrame__seller">
          <div className="blueFrame__sellerName">{inv.seller.companyName}</div>
          <div className="invText">{inv.seller.addressLines.join('\n')}</div>
        </div>

        <PartyBlock
          title="INVOICE TO:"
          name={inv.billTo.name}
          companyName={inv.billTo.companyName}
          addressLines={inv.billTo.addressLines}
        />

        <div className="blueFrame__meta">
          <div className="metaLine">
            <span>Invoice Number</span>
            <strong>{inv.meta.invoiceNumber}</strong>
          </div>
          <div className="metaLine">
            <span>Date of Invoice</span>
            <strong>{inv.meta.invoiceDate}</strong>
          </div>
          <div className="metaLine">
            <span>Due Date</span>
            <strong>{inv.meta.dueDate}</strong>
          </div>
        </div>
      </div>

      <div className="blueFrame__table">
        <ItemsTable invoice={inv} items={inv.items} />
      </div>

      <div className="blueFrame__bottom">
        <div className="blueFrame__left">
          <div className="smallTitle">NOTES:</div>
          <div className="invText">{inv.notes || '—'}</div>
          <BankDetailsBlock bank={inv.bank} />
          <div className="smallTitle" style={{ marginTop: 12 }}>
            TERMS AND CONDITIONS:
          </div>
          <div className="invText">{inv.terms || '—'}</div>
        </div>
        <div className="blueFrame__right">
          <TotalsBlock invoice={inv} totals={props.totals} />
        </div>
      </div>

      <div className="blueFrame__bar blueFrame__bar--bottom" />
      <div className="blueFrame__footerMark">InvoiceBerry style</div>
    </div>
  )
}

