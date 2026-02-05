import type { ReactNode } from 'react'

/**
 * 表单字段容器（Label + 控件）。
 */
export function Field(props: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{props.label}</span>
      <span className="field__control">{props.children}</span>
    </label>
  )
}

