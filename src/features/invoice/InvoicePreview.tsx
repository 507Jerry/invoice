import { forwardRef } from 'react'
import type { Invoice, InvoiceTemplateId, InvoiceTotals } from '../../types/invoice'
import { TemplateOrange } from './templates/TemplateOrange'
import { TemplateBlueFrame } from './templates/TemplateBlueFrame'
import { TemplateBlueLine } from './templates/TemplateBlueLine'
import { TemplateBluePanel } from './templates/TemplateBluePanel'

/**
 * 发票预览 Props。
 */
export interface InvoicePreviewProps {
  invoice: Invoice
  totals: InvoiceTotals
  templateId: InvoiceTemplateId
}

/**
 * 右侧预览区域：渲染 A4 纸张与模板内容。
 * ref 指向实际“纸张根节点”，用于导出 PDF。
 */
export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  function InvoicePreview(props, ref) {
    return (
      <div className="preview">
        <div className="paper" ref={ref}>
          {props.templateId === 'orange' && (
            <TemplateOrange invoice={props.invoice} totals={props.totals} />
          )}
          {props.templateId === 'blueFrame' && (
            <TemplateBlueFrame invoice={props.invoice} totals={props.totals} />
          )}
          {props.templateId === 'blueLine' && (
            <TemplateBlueLine invoice={props.invoice} totals={props.totals} />
          )}
          {props.templateId === 'bluePanel' && (
            <TemplateBluePanel invoice={props.invoice} totals={props.totals} />
          )}
        </div>
      </div>
    )
  },
)

