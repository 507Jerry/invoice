import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { InvoiceEditor } from './features/invoice/InvoiceEditor'
import { InvoicePreview } from './features/invoice/InvoicePreview'
import { calcInvoiceTotals } from './utils/invoiceCalc'
import { exportElementToPdfA4 } from './utils/pdf'
import type { Invoice, InvoiceTemplateId } from './types/invoice'
import {
  clearInvoiceDraft,
  loadInvoiceDraft,
  loadInvoicePresets,
  saveInvoiceDraft,
  saveInvoicePresets,
  type InvoicePreset,
} from './utils/storage'

/**
 * 创建一份带有默认值的发票。
 */
function createDefaultInvoice(): Invoice {
  return {
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
  }
}

/**
 * App 根组件：承载发票数据、模板选择与 PDF 导出。
 */
function App() {
  const [templateId, setTemplateId] = useState<InvoiceTemplateId>('orange')
  const [presets, setPresets] = useState<InvoicePreset[]>(() => loadInvoicePresets())
  const [selectedPresetId, setSelectedPresetId] = useState<string>('none')
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const saved = loadInvoiceDraft()
    if (saved) {
      // 确保每一行条目都有 id
      const itemsWithId = (saved.items ?? []).map((item) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
      }))
      return { ...createDefaultInvoice(), ...saved, items: itemsWithId }
    }
    return createDefaultInvoice()
  })

  const totals = useMemo(() => calcInvoiceTotals(invoice), [invoice])
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // 自动把当前表单内容保存到 localStorage，方便下次打开时自动带出固定信息
  useEffect(() => {
    saveInvoiceDraft(invoice)
  }, [invoice])

  /**
   * 从当前表单创建一个预设对象。
   */
  function createPresetFromInvoice(id: string, name: string): InvoicePreset {
    return {
      id,
      name,
      seller: invoice.seller,
      bank: invoice.bank,
      paymentInstructions: invoice.paymentInstructions,
      terms: invoice.terms,
      notes: invoice.notes,
      signatoryName: invoice.signatoryName,
    }
  }

  function handleReset() {
    const fresh = createDefaultInvoice()
    setInvoice(fresh)
    clearInvoiceDraft()
  }

  function handleApplyPreset(id: string) {
    setSelectedPresetId(id)
    if (id === 'none') return
    const preset = presets.find((p) => p.id === id)
    if (!preset) return
    setInvoice((prev) => ({
      ...prev,
      seller: preset.seller,
      bank: preset.bank,
      paymentInstructions: preset.paymentInstructions,
      terms: preset.terms,
      notes: preset.notes,
      signatoryName: preset.signatoryName,
    }))
  }

  function handleSavePreset() {
    const defaultName = presets.length === 0 ? 'My company' : `Preset ${presets.length + 1}`
    const nameInput = window.prompt('Preset name', defaultName)
    const name = nameInput?.trim()
    if (!name) return
    let existing: InvoicePreset | undefined
    if (selectedPresetId !== 'none') {
      existing = presets.find((p) => p.id === selectedPresetId)
    }
    if (!existing) {
      existing = presets.find((p) => p.name === name)
    }

    const id = existing ? existing.id : crypto.randomUUID()
    const nextPreset = createPresetFromInvoice(id, name)
    const nextList = [
      ...presets.filter((p) => p.id !== id),
      nextPreset,
    ].sort((a, b) => a.name.localeCompare(b.name))

    setPresets(nextList)
    setSelectedPresetId(id)
    saveInvoicePresets(nextList)
  }

  function handleDeletePreset() {
    if (selectedPresetId === 'none') return
    const target = presets.find((p) => p.id === selectedPresetId)
    const label = target?.name ?? 'this preset'
    const ok = window.confirm(`Delete preset "${label}"?`)
    if (!ok) return
    const nextList = presets.filter((p) => p.id !== selectedPresetId)
    setPresets(nextList)
    saveInvoicePresets(nextList)
    setSelectedPresetId('none')
  }

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
          <label className="topBar__label">
            Preset
            <select
              className="control control--select"
              value={selectedPresetId}
              onChange={(e) => handleApplyPreset(e.target.value)}
            >
              <option value="none">None</option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button"
            type="button"
            onClick={handleSavePreset}
          >
            Save preset
          </button>
          {selectedPresetId !== 'none' && presets.length > 0 ? (
            <button
              className="button"
              type="button"
              onClick={handleDeletePreset}
            >
              Delete preset
            </button>
          ) : null}
          <button
            className="button"
            type="button"
            onClick={handleReset}
          >
            Reset form
          </button>
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
