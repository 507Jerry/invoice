import type { Invoice, InvoiceTotals } from '../../../types/invoice'
import { formatMoney } from '../../../utils/money'
import { BankDetailsBlock, ItemsTable, LogoMark, PartyBlock, TotalsBlock } from './shared'

/**
 * 模板 3：蓝色线条商务风（参考你上传的蓝色线条风格）。
 */
export function TemplateBlueLine(props: { invoice: Invoice; totals: InvoiceTotals }) {
  const inv = props.invoice
  const cur = inv.meta.currency

  return (
    <div className="tpl tpl--blueLine">
      <div className="blueLine__top">
        <div className="blueLine__left">
          <div className="blueLine__title">INVOICE</div>
          <div className="blueLine__sellerName">{inv.seller.companyName}</div>
          <div className="invText">{inv.seller.addressLines.join('\n')}</div>
          {inv.seller.phone ? <div className="invText">Mobile: {inv.seller.phone}</div> : null}
          {inv.seller.email ? <div className="invText">Email: {inv.seller.email}</div> : null}
        </div>
        <div className="blueLine__logo">
          <LogoMark dataUrl={inv.logo.dataUrl} variant="square" />
        </div>
      </div>

      <div className="blueLine__divider" />

      <div className="blueLine__mid">
        <div className="blueLine__bill">
          <PartyBlock
            title="Bill To"
            name={inv.billTo.name}
            companyName={inv.billTo.companyName}
            addressLines={inv.billTo.addressLines}
            phone={inv.billTo.phone}
            email={inv.billTo.email}
          />
        </div>

        <div className="blueLine__meta">
          <div className="metaLine metaLine--big">
            <span>Invoice No :</span>
            <strong>{inv.meta.invoiceNumber}</strong>
          </div>
          <div className="metaLine">
            <span>Invoice Date :</span>
            <strong>{inv.meta.invoiceDate}</strong>
          </div>
          <div className="metaLine">
            <span>Due Date :</span>
            <strong>{inv.meta.dueDate}</strong>
          </div>
          <div className="metaLine">
            <span>Terms :</span>
            <strong>{inv.meta.paymentTerms}</strong>
          </div>
        </div>
      </div>

      <div className="blueLine__table">
        <ItemsTable invoice={inv} items={inv.items} columns={{ showSl: true }} />
      </div>

      <div className="blueLine__bottom">
        <div className="blueLine__pay">
          <div className="smallTitle blueLine__payTitle">Payment Instructions</div>
          <div className="invText">{inv.paymentInstructions || '—'}</div>
          <BankDetailsBlock bank={inv.bank} />
        </div>

        <div className="blueLine__totals">
          <TotalsBlock invoice={inv} totals={props.totals} />
          <div className="blueLine__paidNote">
            Paid ({inv.meta.invoiceDate}){' '}
            <strong>{formatMoney(props.totals.amountPaid, cur)}</strong>
          </div>
        </div>
      </div>

      <div className="blueLine__sign">
        <div className="blueLine__signLine" />
        <div className="blueLine__signName">{inv.signatoryName || 'Authorized Signatory'}</div>
      </div>
    </div>
  )
}

