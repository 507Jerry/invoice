import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * 导出选定 DOM 元素为 A4 PDF（支持多页）。
 *
 * 注意：
 * - 建议传入“纸张根容器”，其背景应为白色，避免透明导致 PDF 变黑。
 * - 若预览区域做了 transform 缩放，请传入未缩放的实际纸张节点。
 *
 * @param el - 要导出的元素
 * @param options - 文件名等选项
 */
export async function exportElementToPdfA4(
  el: HTMLElement,
  options?: { filename?: string },
): Promise<void> {
  const filename = options?.filename ?? 'invoice.pdf'

  // 先把滚动位置固定，避免截图错位
  const prevScrollX = window.scrollX
  const prevScrollY = window.scrollY

  // html2canvas 会按当前视觉渲染；使用较高 scale 提升清晰度
  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  })

  window.scrollTo(prevScrollX, prevScrollY)

  const imgData = canvas.toDataURL('image/png')

  // A4: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidth = 210
  const pageHeight = 297

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST',
    )
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}

