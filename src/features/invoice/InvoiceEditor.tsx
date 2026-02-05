import { useId } from 'react'
import { Field } from '../../components/Field'
import type { CurrencyCode, Invoice, InvoiceItem, InvoiceTotals } from '../../types/invoice'
import { formatMoney, parseNumber } from '../../utils/money'

/**
 * 发票编辑器 Props。
 */
export interface InvoiceEditorProps {
  invoice: Invoice
  totals: InvoiceTotals
  onChange: (next: Invoice) => void
}

const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'AUD', label: 'AUD (A$)' },
  { code: 'USD', label: 'USD ($)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'NZD', label: 'NZD (NZ$)' },
  { code: 'CAD', label: 'CAD (C$)' },
  { code: 'SGD', label: 'SGD (S$)' },
]

/**
 * 左侧编辑区域：输入卖方/买方信息、明细行、货币与 GST。
 */
export function InvoiceEditor(props: InvoiceEditorProps) {
  const logoInputId = useId()

  function updateInvoice(patch: Partial<Invoice>) {
    props.onChange({ ...props.invoice, ...patch })
  }

  function updateMeta<K extends keyof Invoice['meta']>(key: K, value: Invoice['meta'][K]) {
    updateInvoice({ meta: { ...props.invoice.meta, [key]: value } })
  }

  function updateSeller<K extends keyof Invoice['seller']>(
    key: K,
    value: Invoice['seller'][K],
  ) {
    updateInvoice({ seller: { ...props.invoice.seller, [key]: value } })
  }

  function updateBillTo<K extends keyof Invoice['billTo']>(
    key: K,
    value: Invoice['billTo'][K],
  ) {
    updateInvoice({ billTo: { ...props.invoice.billTo, [key]: value } })
  }

  function updateShipTo<K extends keyof Invoice['shipTo']>(
    key: K,
    value: Invoice['shipTo'][K],
  ) {
    updateInvoice({ shipTo: { ...props.invoice.shipTo, [key]: value } })
  }

  function updateAdjustments<K extends keyof Invoice['adjustments']>(
    key: K,
    value: Invoice['adjustments'][K],
  ) {
    updateInvoice({ adjustments: { ...props.invoice.adjustments, [key]: value } })
  }

  function updateBank<K extends keyof Invoice['bank']>(
    key: K,
    value: Invoice['bank'][K],
  ) {
    updateInvoice({ bank: { ...props.invoice.bank, [key]: value } })
  }

  function setAddressLines(
    which: 'seller' | 'billTo' | 'shipTo',
    value: string,
  ) {
    const lines = value
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (which === 'seller') updateSeller('addressLines', lines)
    if (which === 'billTo') updateBillTo('addressLines', lines)
    if (which === 'shipTo') updateShipTo('addressLines', lines)
  }

  function updateItem(id: string, patch: Partial<InvoiceItem>) {
    const next = props.invoice.items.map((it) => (it.id === id ? { ...it, ...patch } : it))
    updateInvoice({ items: next })
  }

  function addItem() {
    const next: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      qty: 1,
      unitPrice: 0,
    }
    updateInvoice({ items: [...props.invoice.items, next] })
  }

  function removeItem(id: string) {
    updateInvoice({ items: props.invoice.items.filter((it) => it.id !== id) })
  }

  async function onPickLogo(file: File | null) {
    if (!file) {
      updateInvoice({ logo: { ...props.invoice.logo, dataUrl: null } })
      return
    }

    const dataUrl = await readFileAsDataUrl(file)
    updateInvoice({ logo: { ...props.invoice.logo, dataUrl } })
  }

  return (
    <div className="editor">
      <div className="editor__section">
        <div className="editor__title">Invoice Meta</div>
        <div className="grid2">
          <Field label="Invoice Number">
            <input
              className="control"
              value={props.invoice.meta.invoiceNumber}
              onChange={(e) => updateMeta('invoiceNumber', e.target.value)}
            />
          </Field>
          <Field label="Currency">
            <select
              className="control"
              value={props.invoice.meta.currency}
              onChange={(e) => updateMeta('currency', e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Invoice Date">
            <input
              className="control"
              type="date"
              value={props.invoice.meta.invoiceDate}
              onChange={(e) => updateMeta('invoiceDate', e.target.value)}
            />
          </Field>
          <Field label="Due Date">
            <input
              className="control"
              type="date"
              value={props.invoice.meta.dueDate}
              onChange={(e) => updateMeta('dueDate', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Payment Terms">
          <input
            className="control"
            value={props.invoice.meta.paymentTerms}
            onChange={(e) => updateMeta('paymentTerms', e.target.value)}
          />
        </Field>
      </div>

      <div className="editor__section">
        <div className="editor__title">Logo (optional)</div>
        <div className="logoRow">
          <input
            id={logoInputId}
            className="control"
            type="file"
            accept="image/*"
            onChange={(e) => onPickLogo(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            className="button"
            onClick={() => onPickLogo(null)}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">Seller</div>
        <Field label="Company Name">
          <input
            className="control"
            value={props.invoice.seller.companyName}
            onChange={(e) => updateSeller('companyName', e.target.value)}
          />
        </Field>
        <Field label="Address (one line per row)">
          <textarea
            className="control"
            rows={4}
            value={props.invoice.seller.addressLines.join('\n')}
            onChange={(e) => setAddressLines('seller', e.target.value)}
          />
        </Field>
        <div className="grid2">
          <Field label="Phone">
            <input
              className="control"
              value={props.invoice.seller.phone}
              onChange={(e) => updateSeller('phone', e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className="control"
              value={props.invoice.seller.email}
              onChange={(e) => updateSeller('email', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">Bill To</div>
        <Field label="Contact Name">
          <input
            className="control"
            value={props.invoice.billTo.name}
            onChange={(e) => updateBillTo('name', e.target.value)}
          />
        </Field>
        <Field label="Company Name">
          <input
            className="control"
            value={props.invoice.billTo.companyName}
            onChange={(e) => updateBillTo('companyName', e.target.value)}
          />
        </Field>
        <Field label="Address (one line per row)">
          <textarea
            className="control"
            rows={4}
            value={props.invoice.billTo.addressLines.join('\n')}
            onChange={(e) => setAddressLines('billTo', e.target.value)}
          />
        </Field>
        <div className="grid2">
          <Field label="Phone">
            <input
              className="control"
              value={props.invoice.billTo.phone}
              onChange={(e) => updateBillTo('phone', e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className="control"
              value={props.invoice.billTo.email}
              onChange={(e) => updateBillTo('email', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">Ship To (optional)</div>
        <Field label="Name / Dept">
          <input
            className="control"
            value={props.invoice.shipTo.name}
            onChange={(e) => updateShipTo('name', e.target.value)}
          />
        </Field>
        <Field label="Company Name">
          <input
            className="control"
            value={props.invoice.shipTo.companyName}
            onChange={(e) => updateShipTo('companyName', e.target.value)}
          />
        </Field>
        <Field label="Address (one line per row)">
          <textarea
            className="control"
            rows={3}
            value={props.invoice.shipTo.addressLines.join('\n')}
            onChange={(e) => setAddressLines('shipTo', e.target.value)}
          />
        </Field>
        <div className="grid2">
          <Field label="Phone">
            <input
              className="control"
              value={props.invoice.shipTo.phone}
              onChange={(e) => updateShipTo('phone', e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className="control"
              value={props.invoice.shipTo.email}
              onChange={(e) => updateShipTo('email', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">Line Items</div>
        <div className="items">
          <div className="items__head">
            <div>Description</div>
            <div className="items__num">Qty</div>
            <div className="items__num">Unit</div>
            <div />
          </div>
          {props.invoice.items.map((it) => (
            <div key={it.id} className="items__row">
              <input
                className="control"
                value={it.description}
                onChange={(e) => updateItem(it.id, { description: e.target.value })}
                placeholder="Description"
              />
              <input
                className="control"
                inputMode="decimal"
                value={String(it.qty)}
                onChange={(e) => updateItem(it.id, { qty: parseNumber(e.target.value) })}
              />
              <input
                className="control"
                inputMode="decimal"
                value={String(it.unitPrice)}
                onChange={(e) =>
                  updateItem(it.id, { unitPrice: parseNumber(e.target.value) })
                }
              />
              <button
                className="button"
                type="button"
                onClick={() => removeItem(it.id)}
                title="Remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button className="button" type="button" onClick={addItem}>
            + Add item
          </button>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">GST / Discounts</div>
        <div className="grid2">
          <Field label="Discount (amount)">
            <input
              className="control"
              inputMode="decimal"
              value={String(props.invoice.adjustments.discount)}
              onChange={(e) => updateAdjustments('discount', parseNumber(e.target.value))}
            />
          </Field>
          <Field label="Amount Paid">
            <input
              className="control"
              inputMode="decimal"
              value={String(props.invoice.adjustments.amountPaid)}
              onChange={(e) => updateAdjustments('amountPaid', parseNumber(e.target.value))}
            />
          </Field>
        </div>
        <div className="grid2">
          <Field label="GST Enabled">
            <select
              className="control"
              value={props.invoice.adjustments.gstEnabled ? 'yes' : 'no'}
              onChange={(e) => updateAdjustments('gstEnabled', e.target.value === 'yes')}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="GST Rate (%)">
            <input
              className="control"
              inputMode="decimal"
              value={String(props.invoice.adjustments.gstRatePercent)}
              onChange={(e) =>
                updateAdjustments('gstRatePercent', parseNumber(e.target.value))
              }
              disabled={!props.invoice.adjustments.gstEnabled}
            />
          </Field>
        </div>
        <div className="totalsMini">
          <div className="totalsMini__row">
            <span>Subtotal</span>
            <span>{formatMoney(props.totals.subtotal, props.invoice.meta.currency)}</span>
          </div>
          <div className="totalsMini__row">
            <span>Discount</span>
            <span>
              -{formatMoney(props.totals.discount, props.invoice.meta.currency)}
            </span>
          </div>
          <div className="totalsMini__row">
            <span>GST</span>
            <span>{formatMoney(props.totals.gstAmount, props.invoice.meta.currency)}</span>
          </div>
          <div className="totalsMini__row totalsMini__row--strong">
            <span>Total</span>
            <span>{formatMoney(props.totals.total, props.invoice.meta.currency)}</span>
          </div>
        </div>
      </div>

      <div className="editor__section">
        <div className="editor__title">Bank Details (optional)</div>
        <p className="editor__hint">
          Add your bank information so clients can pay by transfer. Leave blank if not needed.
        </p>
        <Field label="Bank Name">
          <input
            className="control"
            value={props.invoice.bank.bankName}
            onChange={(e) => updateBank('bankName', e.target.value)}
            placeholder="e.g. Commonwealth Bank"
          />
        </Field>
        <Field label="Account Name">
          <input
            className="control"
            value={props.invoice.bank.accountName}
            onChange={(e) => updateBank('accountName', e.target.value)}
            placeholder="Payee name"
          />
        </Field>
        <div className="grid2">
          <Field label="Account Number">
            <input
              className="control"
              value={props.invoice.bank.accountNumber}
              onChange={(e) => updateBank('accountNumber', e.target.value)}
              placeholder="Account number"
            />
          </Field>
          <Field label="BSB / Sort Code / Routing">
            <input
              className="control"
              value={props.invoice.bank.bsbSortCode}
              onChange={(e) => updateBank('bsbSortCode', e.target.value)}
              placeholder="BSB, Sort code, etc."
            />
          </Field>
        </div>
        <div className="grid2">
          <Field label="SWIFT / BIC">
            <input
              className="control"
              value={props.invoice.bank.swiftBic}
              onChange={(e) => updateBank('swiftBic', e.target.value)}
              placeholder="SWIFT code"
            />
          </Field>
          <Field label="IBAN">
            <input
              className="control"
              value={props.invoice.bank.iban}
              onChange={(e) => updateBank('iban', e.target.value)}
              placeholder="IBAN (if applicable)"
            />
          </Field>
        </div>
        <Field label="Additional bank details (free text)">
          <textarea
            className="control"
            rows={3}
            value={props.invoice.bank.additionalDetails}
            onChange={(e) => updateBank('additionalDetails', e.target.value)}
            placeholder="Any other bank or payment reference"
          />
        </Field>
      </div>

      <div className="editor__section">
        <div className="editor__title">Notes / Terms</div>
        <Field label="Payment Instructions">
          <textarea
            className="control"
            rows={2}
            value={props.invoice.paymentInstructions}
            onChange={(e) => updateInvoice({ paymentInstructions: e.target.value })}
          />
        </Field>
        <Field label="Notes">
          <textarea
            className="control"
            rows={3}
            value={props.invoice.notes}
            onChange={(e) => updateInvoice({ notes: e.target.value })}
          />
        </Field>
        <Field label="Terms and Conditions">
          <textarea
            className="control"
            rows={3}
            value={props.invoice.terms}
            onChange={(e) => updateInvoice({ terms: e.target.value })}
          />
        </Field>
        <Field label="Signatory Name">
          <input
            className="control"
            value={props.invoice.signatoryName}
            onChange={(e) => updateInvoice({ signatoryName: e.target.value })}
          />
        </Field>
      </div>
    </div>
  )
}

/**
 * 读取文件为 dataURL。
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

