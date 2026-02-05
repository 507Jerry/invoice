import './App.css'
import { useMemo, useRef, useState } from 'react'
import { InvoiceEditor } from './features/invoice/InvoiceEditor'
import { InvoicePreview } from './features/invoice/InvoicePreview'
import { calcInvoiceTotals } from './utils/invoiceCalc'
import { exportElementToPdfA4 } from './utils/pdf'
import type { Invoice, InvoiceTemplateId } from './types/invoice'

/**
 * App 根组件：承载发票数据、模板选择与 PDF 导出。
 */
function App() {
  const [templateId, setTemplateId] = useState<InvoiceTemplateId>('orange')
  const [invoice, setInvoice] = useState<Invoice>(() => ({
    meta: {
      invoiceNumber: 'INV-0001',
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      paymentTerms: 'Due on receipt',
      currency: 'EUR',
    },
    seller: {
      name: '',
      companyName: 'Your Company Name',
      addressLines: ['Street address', 'City, State', 'Country', 'Postal'],
      phone: '',
      email: '',
    },
    billTo: {
      name: 'Client Name',
      companyName: 'Client Company Name',
      addressLines: ['Street address', 'City, State', 'Country', 'Postal'],
      phone: '',
      email: '',
    },
    shipTo: {
      name: '',
      companyName: '',
      addressLines: [],
      phone: '',
      email: '',
    },
    logo: {
      dataUrl: null,
      alt: 'Logo',
    },
    items: [
      { id: crypto.randomUUID(), description: 'Widget 1', qty: 1, unitPrice: 5 },
      { id: crypto.randomUUID(), description: 'Item 2', qty: 1, unitPrice: 7 },
      { id: crypto.randomUUID(), description: 'Tool 3', qty: 1, unitPrice: 8 },
    ],
    adjustments: {
      discount: 0,
      gstEnabled: true,
      gstRatePercent: 10,
      amountPaid: 0,
    },
    bank: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      bsbSortCode: '',
      swiftBic: '',
      iban: '',
      additionalDetails: '',
    },
    notes: 'Thank you for your business.',
    terms: 'Payment is due within the stated terms.',
    paymentInstructions: 'Bank transfer / PayID / Cheque',
    signatoryName: 'Authorized Signatory',
  }))

  const totals = useMemo(() => calcInvoiceTotals(invoice), [invoice])
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  async function onExportPdf() {
    if (!previewRef.current) return
    try {
      setIsExporting(true)
      await exportElementToPdfA4(previewRef.current, {
        filename: `${invoice.meta.invoiceNumber || 'invoice'}.pdf`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="topBar__left">
          <div className="brand">Invoice 2026</div>
          <div className="topBar__hint">
            Edit on the left, preview on the right (English only).
          </div>
        </div>
        <div className="topBar__right">
          <label className="topBar__label">
            Template
            <select
              className="control control--select"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as InvoiceTemplateId)}
            >
              <option value="orange">Orange Header</option>
              <option value="blueFrame">Blue Frame</option>
              <option value="blueLine">Blue Line</option>
            </select>
          </label>
          <button
            className="button button--primary"
            onClick={onExportPdf}
            disabled={isExporting}
            type="button"
          >
            {isExporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </header>

      <main className="mainGrid">
        <section className="panel panel--editor">
          <InvoiceEditor
            invoice={invoice}
            onChange={setInvoice}
            totals={totals}
          />
        </section>

        <section className="panel panel--preview">
          <InvoicePreview
            ref={previewRef}
            invoice={invoice}
            totals={totals}
            templateId={templateId}
          />
        </section>
      </main>
    </div>
  )
}

export default App
